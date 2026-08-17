import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Wasabi owns every other key in this file, so only ever `merge` — never `write`.
// Keys absent here survive the round trip untouched.
const ConfigShape = z.object({
  ConfigVersion: z.number(),
  // Wasabi's schema has no "use RPC" flag: a non-empty endpoint is what enables
  // it, and the endpoint must be an absolute URI.
  BitcoinRpcEndPoint: z.string(),
  BitcoinRpcCredentialString: z.string(),
  UseTor: z.union([z.literal('Enabled'), z.literal('Disabled')]),
  JsonRpcServerEnabled: z.boolean(),
  JsonRpcUser: z.string(),
  JsonRpcPassword: z.string(),
  JsonRpcServerPrefixes: z.array(z.string()),
})

export type ConfigFileType = z.infer<typeof ConfigShape>

export const configFile = FileHelper.json(
  {
    base: sdk.volumes.userdir,
    subpath: '.walletwasabi/client/Config.json',
  },
  ConfigShape,
)
