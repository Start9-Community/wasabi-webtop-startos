import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.7.2.1'

export const v2_7_2_3 = VersionInfo.of({
  version: '2.7.2:3',
  releaseNotes: {
    en_US:
      'Adds StartOS 0.4.0-beta.10 and Start SDK 2 compatibility with dynamic Bitcoin RPC routing.',
    es_ES:
      'Añade compatibilidad con StartOS 0.4.0-beta.10 y Start SDK 2 con enrutamiento RPC de Bitcoin dinámico.',
    de_DE:
      'Fügt Kompatibilität mit StartOS 0.4.0-beta.10 und Start SDK 2 sowie dynamisches Bitcoin-RPC-Routing hinzu.',
    pl_PL:
      'Dodaje zgodność ze StartOS 0.4.0-beta.10 i Start SDK 2 oraz dynamiczny routing Bitcoin RPC.',
    fr_FR:
      'Ajoute la compatibilité avec StartOS 0.4.0-beta.10 et Start SDK 2 avec routage RPC Bitcoin dynamique.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
