import { VersionInfo } from '@start9labs/start-sdk'

export const v2_7_1 = VersionInfo.of({
  version: '2.7.1:1.0',
  releaseNotes: 'Update Wasabi to 2.7.1',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})

export const WASABI_VERSION = '2.7.1'