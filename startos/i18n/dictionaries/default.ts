export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'The web interface is ready': 1,
  'The web interface is unreachable': 2,
  'Password is required': 3,
  'Web Interface': 4,
  'Bitcoin is unavailable': 5,

  // init/
  'Enable Compact Block Filters (BIP158) in Bitcoin': 6,
  'Create RPC credentials for Wasabi': 7,
  'Choose a username and password for the desktop': 8,

  // interfaces.ts
  'Web UI': 100,
  'The Wasabi desktop, in your browser': 101,
  'JSON-RPC': 102,
  "Wasabi's JSON-RPC API for wallet automation": 103,

  // actions/config.ts
  Settings: 200,
  'Desktop credentials, rendering, and Bitcoin connection settings': 201,
  Configuration: 202,
  'Browser Tab Title': 203,
  'Shown as the title of the browser tab.': 204,
  Username: 205,
  'The username for logging into the desktop.': 206,
  Password: 207,
  'The password for logging into the desktop.': 208,
  'Wasabi Settings': 209,
  'How Wasabi connects to Bitcoin and to the network.': 210,
  'Apply Settings On Startup': 211,
  'Disable to manage the server and proxy settings inside Wasabi instead. While enabled, the settings below are re-applied every time the service starts.': 212,
  'Bitcoin Node': 213,
  'The Bitcoin node Wasabi fetches blocks from.': 214,
  'Local Node (recommended)': 215,
  'None (not recommended)': 216,
  'Use Tor': 217,
  "Route Wasabi's own traffic over the Tor network.": 218,
  'JSON-RPC Server': 219,
  "Wasabi's JSON-RPC API, for driving wallets programmatically.": 220,
  'Enable JSON-RPC': 221,
  'Publishes a JSON-RPC interface protected by the credentials below.': 222,
  'JSON-RPC Username': 223,
  'The username for the JSON-RPC server.': 224,
  'JSON-RPC Password': 225,
  'The password for the JSON-RPC server.': 226,
  'Enable Wayland': 227,
  'Use the Wayland desktop backend. Disable this for the older X11 compatibility backend. Force Software Rendering takes precedence and uses X11.': 228,
  'Force Software Rendering': 229,
  'Use the CPU-only X11 compatibility path without graphics devices. Enable this if the Web UI is blank or unstable because of incompatible graphics hardware. This overrides Enable Wayland, is slower, and takes effect after restart.': 230,

  // actions/uiCredentials.ts
  'Show UI Credentials': 300,
  'Show the username and password for the desktop.': 301,
  'Web UI Credentials': 302,
  'Username for the desktop': 303,
  'Password for the desktop': 304,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
