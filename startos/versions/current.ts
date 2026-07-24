import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:0',
  releaseNotes: {
    en_US:
      'Update Wasabi to 2.8.1',
    es_ES:
      'Actualiza Wasabi a 2.8.1.',
    de_DE:
      'Aktualisiert Wasabi auf 2.8.1.',
    pl_PL:
      'Aktualizuje Wasabi do 2.8.1.',
    fr_FR:
      'Met à jour Wasabi vers 2.8.1.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
