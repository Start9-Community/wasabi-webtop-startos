import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v2_7_2 = VersionInfo.of({
  version: '2.7.2:1-beta.0',
  releaseNotes: 'Update Wasabi to 2.7.2',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const WASABI_VERSION = '2.7.2'