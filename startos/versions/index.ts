import { VersionGraph } from '@start9labs/start-sdk'
import { current, WASABI_VERSION } from './current'
import { v2_7_2 } from './v2.7.2'
import { v2_7_2_2 } from './v2.7.2_2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v2_7_2_2, v2_7_2],
})

export { WASABI_VERSION }
