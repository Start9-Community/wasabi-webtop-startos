import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v2_7_2_2 = VersionInfo.of({
  version: '2.7.2:2',
  releaseNotes: {
    en_US: 'Replace (deprecated) KASM webtop with new Selkies webtop',
    es_ES: 'Reemplazo de (obsoleto) KASM webtop con el nuevo Selkies webtop',
    de_DE: 'Ersetzen von (veraltet) KASM Webtop durch neues Selkies Webtop',
    pl_PL: 'Zastąpienie (przestarzałego) KASM webtop nowym Selkies webtop',
    fr_FR: 'Remplacement de (obsolète) KASM webtop par le nouveau Selkies webtop',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})

export const WASABI_VERSION = '2.7.2.1'
