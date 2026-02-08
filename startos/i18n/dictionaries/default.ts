export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'The web interface is ready': 1,
  'The web interface is unreachable': 2,
  'Password is required': 3,
  'Web Interface': 4,

  // interfaces.ts
  'Web UI': 100,
  'JSON-RPC': 101,
  'JSON-RPC Interface': 102,

  // manifest/index.ts
  'Used to connect to your Bitcoin node.': 200,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
