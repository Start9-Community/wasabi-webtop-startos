import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string().optional(),
  reconnect: z.boolean().catch(false),
  wasabi: z.object({
    managesettings: z.boolean(),
    server: z.object({
      type: z
        .union([z.literal('bitcoind'), z.literal('none')])
        .catch('bitcoind'),
      user: z.string(),
      password: z.string(),
    }),
    useTor: z.boolean(),
    rpc: z.object({
      enable: z.boolean(),
      username: z.string().optional(),
      password: z.string().optional(),
    }),
  }),
})

export type StoreType = z.infer<typeof shape>

export const store = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'start9/config.yaml',
  },
  shape,
)

export const createDefaultStore = async (effects: T.Effects) => {
  // check if the file exists (from previous installs or upgrades)
  const conf = await store.read().once()
  if (conf) {
    console.log('Wasabi config file already exists, clearing RPC credentials')
    await store.merge(effects, {
      wasabi: {
        server: {
          user: '',
          password: '',
        },
      },
    })
    return
  }

  // config file does not exist, create it
  console.log('Wasabi config file does not exist, creating it')
  const installedPackages = await effects.getInstalledPackages()
  const serverType = installedPackages.includes('bitcoind')
    ? 'bitcoind'
    : 'none'

  await store.write(effects, {
    title: 'Wasabi Wallet on StartOS',
    username: 'webtop',
    reconnect: false,
    wasabi: {
      managesettings: true,
      server: {
        type: serverType,
        user: '',
        password: '',
      },
      useTor: true,
      rpc: {
        enable: false,
      },
    },
  })
}
