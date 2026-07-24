import { bitcoinConfFile } from 'bitcoin-core-startos/startos/fileModels/bitcoin.conf'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'
import { generateRpcPassword } from '../utils'
import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { i18n } from '../i18n'

export const watchBitcoinRPCUsers = sdk.setupOnInit(async (effects, kind) => {
  const settings = await store.read((x) => x).const(effects)

  if (
    settings?.wasabi?.managesettings &&
    settings.wasabi.server.type == 'bitcoind'
  ) {
    const currentUser = settings.wasabi.server.user
    const currentPassword = settings.wasabi.server.password

    if (!currentUser || !currentPassword) {
      const username = 'wasabi_' + generateRpcPassword(6)
      const password = generateRpcPassword()

      // allowWriteAfterConst is needed because we are writing to the store after reading it,
      // this will trigger a re-run of this hook, but it will enter the else branch
      await store.merge(
        effects,
        {
          wasabi: {
            server: {
              user: username,
              password: password,
            },
          },
        },
        { allowWriteAfterConst: true },
      )
    } else {
      await sdk.SubContainer.withTemp(
        effects,
        {
          imageId: 'main',
        },
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

          const rpcAuth = bitcoinConf?.raw?.rpcauth ?? []
          const users = [rpcAuth]
            .flat()
            .filter((e): e is string => !!e)
            .map((e) => e.split(':', 2))
          const rpcAuthEntry = users.find((e) => e[0] == currentUser)

          if (!rpcAuthEntry) {
            await sdk.action.createTask(
              effects,
              'bitcoind',
              generateRpcUserDependent,
              'critical',
              {
                replayId: 'request-rpc-credentials',
                reason: i18n('Create RPC credentials for Wasabi'),
                input: {
                  kind: 'partial',
                  accept: [
                    {
                      username: settings!.wasabi.server.user,
                      password: settings!.wasabi.server.password,
                    },
                  ],
                  set: {
                    username: settings!.wasabi.server.user,
                    password: settings!.wasabi.server.password,
                  },
                },
              },
            )
          }
        },
      )
    }
  } else {
    sdk.action.clearTask(effects, 'request-rpc-credentials')
  }
})
