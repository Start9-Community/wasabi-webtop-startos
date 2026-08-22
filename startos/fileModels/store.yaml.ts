import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { generateRpcPassword } from '../utils'

const shape = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string().optional(),
  enableWayland: z.boolean().catch(true),
  forceSoftwareRendering: z.boolean().catch(false),
  wasabi: z.object({
    managesettings: z.boolean(),
    server: z.object({
      type: z
        .union([z.literal('bitcoind'), z.literal('none')])
        .catch('bitcoind'),
      user: z.string().catch(''),
      password: z.string().catch(''),
    }),
    useTor: z.boolean(),
    rpc: z.object({
      enable: z.boolean(),
      username: z.string().catch('wasabi'),
      password: z.string().catch(''),
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
  const installedPackages = await effects.getInstalledPackages()

  await store.write(effects, {
    title: 'Wasabi Wallet on StartOS',
    username: 'webtop',
    enableWayland: true,
    forceSoftwareRendering: false,
    wasabi: {
      managesettings: true,
      server: {
        type: installedPackages.includes('bitcoind') ? 'bitcoind' : 'none',
        user: '',
        password: '',
      },
      useTor: true,
      rpc: {
        enable: false,
        username: 'wasabi',
        password: generateRpcPassword(20),
      },
    },
  })
}
