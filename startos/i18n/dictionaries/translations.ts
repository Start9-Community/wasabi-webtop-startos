import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'La interfaz web está lista',
    2: 'La interfaz web no está accesible',
    3: 'Se requiere contraseña',
    4: 'Interfaz web',

    // interfaces.ts
    100: 'Interfaz web',
    101: 'JSON-RPC',
    102: 'Interfaz JSON-RPC',

    // manifest/index.ts
    200: 'Usado para conectar a tu nodo Bitcoin.',
  },
  de_DE: {
    // main.ts
    1: 'Die Weboberfläche ist bereit',
    2: 'Die Weboberfläche ist nicht erreichbar',
    3: 'Passwort ist erforderlich',
    4: 'Weboberfläche',

    // interfaces.ts
    100: 'Weboberfläche',
    101: 'JSON-RPC',
    102: 'JSON-RPC-Schnittstelle',

    // manifest/index.ts
    200: 'Wird verwendet, um eine Verbindung zu Ihrem Bitcoin-Knoten herzustellen.',
  },
  pl_PL: {
    // main.ts
    1: 'Interfejs webowy jest gotowy',
    2: 'Interfejs webowy jest niedostępny',
    3: 'Wymagane jest hasło',
    4: 'Interfejs webowy',

    // interfaces.ts
    100: 'Interfejs webowy',
    101: 'JSON-RPC',
    102: 'Interfejs JSON-RPC',

    // manifest/index.ts
    200: 'Używany do połączenia z twoim węzłem Bitcoin.',
  },
  fr_FR: {
    // main.ts
    1: "L'interface web est prête",
    2: "L'interface web est inaccessible",
    3: 'Mot de passe requis',
    4: 'Interface web',

    // interfaces.ts
    100: 'Interface web',
    101: 'JSON-RPC',
    102: 'Interface JSON-RPC',

    // manifest/index.ts
    200: 'Utilisé pour se connecter à votre nœud Bitcoin.',
  },
} satisfies Record<string, LangDict>
