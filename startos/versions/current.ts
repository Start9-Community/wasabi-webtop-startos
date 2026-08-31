import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.2'

export const current = VersionInfo.of({
  version: '2.8.2:1',
  releaseNotes: {
    en_US:
      'Updated Wasabi Wallet to 2.8.2. Fixes P2P synchronization after blockchain reorganizations and improves CoinJoin security by verifying other participants’ inputs before signing. [Full release notes](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.2)',
    es_ES:
      'Actualiza Wasabi Wallet a la versión 2.8.2. Corrige la sincronización P2P tras reorganizaciones de la cadena de bloques y mejora la seguridad de CoinJoin al verificar las entradas de otros participantes antes de firmar. [Notas completas de la versión](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.2)',
    de_DE:
      'Aktualisiert Wasabi Wallet auf Version 2.8.2. Behebt die P2P-Synchronisierung nach Blockchain-Reorganisationen und verbessert die CoinJoin-Sicherheit, indem die Eingaben anderer Teilnehmer vor dem Signieren überprüft werden. [Vollständige Versionshinweise](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.2)',
    pl_PL:
      'Aktualizuje Wasabi Wallet do wersji 2.8.2. Naprawia synchronizację P2P po reorganizacjach łańcucha bloków i zwiększa bezpieczeństwo CoinJoin poprzez weryfikację danych wejściowych innych uczestników przed podpisaniem. [Pełne informacje o wydaniu](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.2)',
    fr_FR:
      'Met à jour Wasabi Wallet vers la version 2.8.2. Corrige la synchronisation P2P après les réorganisations de la blockchain et améliore la sécurité de CoinJoin en vérifiant les entrées des autres participants avant la signature. [Notes de version complètes](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.2)',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
