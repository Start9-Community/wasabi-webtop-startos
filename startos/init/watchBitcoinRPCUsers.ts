import { bitcoinConfFile } from 'bitcoin-core-startos/startos/fileModels/bitcoin.conf'
import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'
import {
  generateRpcPassword,
  generateRpcUsername,
  rpcPasswordLength,
} from '../utils'
import { i18n } from '../i18n'

const replayId = 'request-rpc-credentials'

export const watchBitcoinRPCUsers = sdk.setupOnInit(async (effects) => {
  const settings = await store.read().const(effects)

  if (
    !settings?.wasabi.managesettings ||
    settings.wasabi.server.type !== 'bitcoind'
  ) {
    await sdk.action.clearTask(effects, replayId)
    return
  }

  const { user, password } = settings.wasabi.server

  // Writing here re-runs this hook; the branches below then see a credential.
  if (!user || !password) {
    await store.merge(
      effects,
      {
        wasabi: {
          server: {
            user: generateRpcUsername(),
            password: generateRpcPassword(),
          },
        },
      },
      { allowWriteAfterConst: true },
    )
    return
  }

  const registered = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      mountpoint: '/mnt/bitcoind',
      subpath: null,
      readonly: true,
      type: 'directory',
    }),
    'read-bitcoind-conf',
    async (subcontainer) => {
      const bitcoinConf = await bitcoinConfFile
        .withPath(`${subcontainer.rootfs}/mnt/bitcoind/bitcoin.conf`)
        .read()
        .once()

      return [bitcoinConf?.raw?.rpcauth ?? []]
        .flat()
        .some((entry) => !!entry && entry.split(':', 2)[0] === user)
    },
  )

  if (registered) return

  // Bitcoin will not accept a password below its floor and the user cannot edit
  // the one we supply, so rotate before asking rather than raising a task they
  // could never complete.
  if (password.length < rpcPasswordLength) {
    await store.merge(
      effects,
      { wasabi: { server: { password: generateRpcPassword() } } },
      { allowWriteAfterConst: true },
    )
    return
  }

  await sdk.action.createTask(
    effects,
    'bitcoind',
    generateRpcUserDependent,
    'critical',
    {
      replayId,
      reason: i18n('Create RPC credentials for Wasabi'),
      input: {
        kind: 'partial',
        accept: [{ username: user, password }],
        set: { username: user, password },
      },
    },
  )
})
