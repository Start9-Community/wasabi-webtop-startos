import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/*
 * UiConfig.json
 */

// not all possible fields of Wasabi config are included, so
// do not write a new file, use 'merge' instead
const UiConfigShape = z.object({
  Oobe: z.boolean(),
  WindowState: z.union([
    z.literal('Normal'),
    z.literal('Minimized'),
    z.literal('Maximized'),
    z.literal('FullScreen'),
  ]),
})

export type UiConfigFileType = z.infer<typeof UiConfigShape>

export const uiConfigFile = FileHelper.json(
  {
    base: sdk.volumes.userdir,
    subpath: '.walletwasabi/client/UiConfig.json',
  },
  UiConfigShape,
)
