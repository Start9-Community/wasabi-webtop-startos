import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:2',
  releaseNotes: {
    en_US: `Updated Wasabi to 2.8.1 and rebuilt the package for StartOS 0.4.

- Generated Bitcoin RPC credentials now meet the minimum length Bitcoin requires of a connected service, so the credential prompt can always be completed
- The Show UI Credentials and Settings screens, the web interfaces, and every prompt are now translated
- Wasabi's JSON-RPC settings are no longer written before they exist, which could stop the service from starting

[Full upstream release notes](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.1)`,
    es_ES: `Wasabi actualizado a 2.8.1 y paquete reconstruido para StartOS 0.4.

- Las credenciales RPC de Bitcoin generadas ahora cumplen la longitud mínima que Bitcoin exige a un servicio conectado, por lo que la solicitud de credenciales siempre se puede completar
- Las pantallas Mostrar credenciales de la interfaz y Ajustes, las interfaces web y todos los avisos están ahora traducidos
- Los ajustes JSON-RPC de Wasabi ya no se escriben antes de existir, lo que podía impedir que el servicio arrancara

[Notas de la versión original](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.1)`,
    de_DE: `Wasabi auf 2.8.1 aktualisiert und das Paket für StartOS 0.4 neu aufgebaut.

- Erzeugte Bitcoin-RPC-Zugangsdaten erfüllen jetzt die Mindestlänge, die Bitcoin von einem verbundenen Dienst verlangt, sodass die Abfrage der Zugangsdaten immer abgeschlossen werden kann
- Die Bildschirme „Zugangsdaten anzeigen" und „Einstellungen", die Weboberflächen und alle Hinweise sind jetzt übersetzt
- Wasabis JSON-RPC-Einstellungen werden nicht mehr geschrieben, bevor es sie gibt — das konnte den Start des Dienstes verhindern

[Vollständige Upstream-Release-Notes](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.1)`,
    pl_PL: `Zaktualizowano Wasabi do 2.8.1 i przebudowano pakiet dla StartOS 0.4.

- Generowane dane logowania RPC Bitcoina spełniają teraz minimalną długość wymaganą przez Bitcoina od połączonej usługi, więc prośbę o dane logowania zawsze można ukończyć
- Ekrany „Pokaż dane logowania" i „Ustawienia", interfejsy webowe oraz wszystkie komunikaty są teraz przetłumaczone
- Ustawienia JSON-RPC Wasabi nie są już zapisywane, zanim powstaną — mogło to uniemożliwić uruchomienie usługi

[Pełne informacje o wydaniu](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.1)`,
    fr_FR: `Wasabi mis à jour vers 2.8.1 et paquet reconstruit pour StartOS 0.4.

- Les identifiants RPC Bitcoin générés respectent désormais la longueur minimale que Bitcoin exige d'un service connecté, de sorte que la demande d'identifiants peut toujours être complétée
- Les écrans « Afficher les identifiants » et « Paramètres », les interfaces web et toutes les invites sont désormais traduits
- Les paramètres JSON-RPC de Wasabi ne sont plus écrits avant d'exister, ce qui pouvait empêcher le service de démarrer

[Notes de version complètes](https://github.com/WalletWasabi/WalletWasabi/releases/tag/v2.8.1)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
