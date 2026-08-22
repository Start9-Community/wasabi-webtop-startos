import { sdk } from './sdk'
import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'
import {
  ensureFileExists,
  jsonRpcPort,
  removeUtf8BOMCharacter,
  uiPort,
  wasabiConfigVersion,
} from './utils'
import { store } from './fileModels/store.yaml'
import { configFile, ConfigFileType } from './fileModels/config.json'
import { uiConfigFile } from './fileModels/uiConfig.json'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  const conf = (await store.read().const(effects))!

  if (!conf.password) {
    throw new Error(i18n('Password is required'))
  }

  const bitcoinRpc =
    conf.wasabi.managesettings && conf.wasabi.server.type === 'bitcoind'
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'bitcoind',
            hostId: rpcHostId,
            internalPort: rpcPort,
            ssl: false,
          })
          .const()
      : null

  const subcontainer = await sdk.SubContainer.eager(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root/data',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'userdir',
        subpath: null,
        mountpoint: '/config',
        readonly: false,
      }),
    'main',
  )

  if (!conf.forceSoftwareRendering) {
    // StartOS binds DRI devices into the container as root:root, so the
    // unprivileged desktop user cannot open them without this.
    await subcontainer.exec([
      'sh',
      '-c',
      'ls /dev/dri/* 2>/dev/null | xargs -r chmod o+rw',
    ])
  }

  const seededConfig = await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/Config.json',
    '/config/.walletwasabi/client/Config.json',
  )
  await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/UiConfig.json',
    '/config/.walletwasabi/client/UiConfig.json',
  )

  await subcontainer.exec(['chown', '-R', '1000:1000', '/config'])

  await removeUtf8BOMCharacter(
    subcontainer,
    '/config/.walletwasabi/client/UiConfig.json',
  )
  await removeUtf8BOMCharacter(
    subcontainer,
    '/config/.walletwasabi/client/Config.json',
  )

  // Maximized rather than openbox's fullscreen, which glitches Wasabi's canvas.
  await uiConfigFile.merge(effects, {
    Oobe: false,
    WindowState: 'Maximized',
  })

  // The seed claims schema 3 but omits the BackendUri that Wasabi's schema-3
  // decoder requires, so no decoder matches and Wasabi silently discards the
  // whole file for its own defaults — taking the settings below with it, and
  // leaving the wallet syncing over public peers. Relabelling the seed is the
  // repair: its body is already a valid schema 4.
  if (seededConfig) {
    await configFile.merge(effects, { ConfigVersion: wasabiConfigVersion })
  }

  if (conf.wasabi.managesettings) {
    if (conf.wasabi.server.type === 'bitcoind' && !bitcoinRpc) {
      throw new Error(i18n('Bitcoin is unavailable'))
    }

    const server: Partial<ConfigFileType> = bitcoinRpc
      ? {
          BitcoinRpcEndPoint: `http://${bitcoinRpc}`,
          BitcoinRpcCredentialString: `${conf.wasabi.server.user}:${conf.wasabi.server.password}`,
        }
      : {
          BitcoinRpcEndPoint: '',
          BitcoinRpcCredentialString: '',
        }

    await configFile.merge(effects, {
      ...server,
      UseTor: conf.wasabi.useTor ? 'Enabled' : 'Disabled',
      JsonRpcServerEnabled: conf.wasabi.rpc.enable,
      JsonRpcUser: conf.wasabi.rpc.username,
      JsonRpcPassword: conf.wasabi.rpc.password,
      JsonRpcServerPrefixes: [`http://+:${jsonRpcPort}/`],
    })
  }

  // The X11 applications in this image do not render when both the outer
  // compositor and Labwc use their software Wayland paths. Force Software
  // Rendering therefore takes precedence over the stored Wayland preference
  // and selects the validated CPU-only X11 path instead.
  const enableWayland = conf.enableWayland && !conf.forceSoftwareRendering

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: conf.title,
        CUSTOM_USER: conf.username,
        PASSWORD: conf.password,
        PIXELFLUX_WAYLAND: enableWayland ? 'true' : 'false',
        ...(conf.forceSoftwareRendering
          ? {
              AUTO_GPU: 'false',
              SELKIES_USE_CPU: 'true|locked',
              DISABLE_DRI3: 'true',
              DISABLE_ZINK: 'true',
              LIBGL_ALWAYS_SOFTWARE: 'true',
            }
          : {}),
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, `http://127.0.0.1:${uiPort}`, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is unreachable'),
        }),
    },
    requires: [],
  })
})
