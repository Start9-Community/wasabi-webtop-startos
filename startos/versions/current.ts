import { VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.2'

export const current = VersionInfo.of({
  version: '2.8.2:2',
  releaseNotes: {
    en_US:
      'File permissions are now fully applied at startup, even when the wallet data is large or the disk is slow.',
    es_ES:
      'Los permisos de archivos ahora se aplican por completo al iniciar, aunque los datos de la billetera sean grandes o el disco sea lento.',
    de_DE:
      'Dateiberechtigungen werden beim Start jetzt vollständig gesetzt, auch wenn die Wallet-Daten groß sind oder der Datenträger langsam ist.',
    pl_PL:
      'Uprawnienia plików są teraz w pełni ustawiane przy uruchomieniu, nawet gdy dane portfela są duże lub dysk jest wolny.',
    fr_FR:
      'Les permissions des fichiers sont désormais entièrement appliquées au démarrage, même si les données du portefeuille sont volumineuses ou le disque lent.',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
