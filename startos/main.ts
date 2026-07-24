import { sdk } from './sdk'
import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'
import {
  bridgeAddress,
  ensureFileExists,
  removeUtf8BOMCharacter,
  uiPort,
} from './utils'
import { store } from './fileModels/store.yaml'
import { configFile, ConfigFileType } from './fileModels/config.json'
import { uiConfigFile } from './fileModels/uiConfig.json'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('setupMain: Setting up Wasabi webtop...')

  // setup a watch on the store file for changes (this restarts the service)
  const conf = (await store.read().const(effects))!

  if (!conf.password) {
    throw new Error(i18n('Password is required'))
  }

  const bitcoinRpc =
    conf.wasabi.managesettings && conf.wasabi.server.type === 'bitcoind'
      ? await bridgeAddress(effects, {
          packageId: 'bitcoind',
          hostId: rpcHostId,
          internalPort: rpcPort,
        }).const()
      : null

  /*
   * Subcontainer setup
   */
  let mounts = sdk.Mounts.of()
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
    })

  // main subcontainer (the webtop container)
  const subcontainer = await sdk.SubContainer.eager(
    effects,
    {
      imageId: 'main',
    },
    mounts,
    'main',
  )

  /*
   * StarOS-specific: fix /dev/dri permissions
   * StartOS passes DRI devices as root:root, preventing the container user from
   * opening them. chmod o+rw so selkies can use hardware acceleration.
   */
  await subcontainer.exec([
    'sh',
    '-c',
    'ls /dev/dri/* 2>/dev/null | xargs -r chmod o+rw',
  ])

  /*
   * Wasabi settings
   */

  // create default config files if they do not exist
  await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/Config.json',
    '/config/.walletwasabi/client/Config.json',
  )
  await ensureFileExists(
    subcontainer,
    '/defaults/.walletwasabi/client/UiConfig.json',
    '/config/.walletwasabi/client/UiConfig.json',
  )

  // set permissions to the webtop user
  await subcontainer.exec(['chown', '-R', '1000:1000', '/config'])

  // Force windowstate to full-screen. We used to do this through the openbox rc.xml
  // config, but this causes graphical glitches in Wasabi.
  await removeUtf8BOMCharacter(
    subcontainer,
    '/config/.walletwasabi/client/UiConfig.json',
  )

  await uiConfigFile.merge(effects, {
    Oobe: false,
    WindowState: 'Maximized',
  })

  if (conf.wasabi.managesettings) {
    let config: Partial<ConfigFileType> = {
      // Update config version so Wasabi will not try to migrate it
      ConfigVersion: 3,
    }

    // server config
    if (conf.wasabi.server.type == 'bitcoind') {
      if (!bitcoinRpc) {
        throw new Error(i18n('Bitcoin Core is unavailable'))
      }
      config = {
        ...config,
        UseBitcoinRpc: true,
        BitcoinRpcEndPoint: bitcoinRpc,
        BitcoinRpcCredentialString:
          conf.wasabi.server.user + ':' + conf.wasabi.server.password,
      }
    } else if (conf.wasabi.server.type == 'none') {
      config = {
        ...config,
        UseBitcoinRpc: false,
        BitcoinRpcEndPoint: '127.0.0.1:8332',
        BitcoinRpcCredentialString: '',
      }
    }

    config = {
      ...config,
      // Tor
      UseTor: conf.wasabi.useTor ? 'Enabled' : 'Disabled',
      // JSON RPC server
      JsonRpcServerEnabled: conf.wasabi.rpc.enable,
      JsonRpcUser: conf.wasabi.rpc.username,
      JsonRpcPassword: conf.wasabi.rpc.password,
      JsonRpcServerPrefixes: ['http://+:37128/'],
    }

    // merge with existing config file
    await removeUtf8BOMCharacter(
      subcontainer,
      '/config/.walletwasabi/client/Config.json',
    )

    await configFile.merge(effects, config)
  }

  /*
   * Daemons
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true, // If true, this daemon will be run as PID 1 in the container.
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: conf.title,
        CUSTOM_USER: conf.username,
        PASSWORD: conf.password,
        //COMPlus_DbgEnableMiniDump: '1',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, 'http://127.0.0.1:' + uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is unreachable'),
        }),
    },
    requires: [],
  })
})
