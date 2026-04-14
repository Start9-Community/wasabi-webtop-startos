import { VersionGraph } from '@start9labs/start-sdk'
import { v2_7_2, WASABI_VERSION } from './v2.7.2'

export const versionGraph = VersionGraph.of({
  current: v2_7_2,
  other: [],
})

export { WASABI_VERSION }
