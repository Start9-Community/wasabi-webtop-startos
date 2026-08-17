import { sdk } from '../sdk'
import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../fileModels/store.yaml'
import { i18n } from '../i18n'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  title: Value.text({
    name: i18n('Browser Tab Title'),
    description: i18n('Shown as the title of the browser tab.'),
    required: true,
    default: 'Wasabi Wallet on StartOS',
    placeholder: 'Wasabi Wallet on StartOS',
    patterns: [utils.Patterns.ascii],
  }),
  username: Value.text({
    name: i18n('Username'),
    description: i18n('The username for logging into the desktop.'),
    required: true,
    default: 'webtop',
    placeholder: '',
    masked: false,
    patterns: [utils.Patterns.ascii],
  }),
  password: Value.text({
    name: i18n('Password'),
    description: i18n('The password for logging into the desktop.'),
    required: true,
    generate: { charset: 'a-z,0-9', len: 20 },
    default: { charset: 'a-z,0-9', len: 20 },
    placeholder: '',
    masked: true,
    minLength: 8,
  }),
  wasabi: Value.object(
    {
      name: i18n('Wasabi Settings'),
      description: i18n('How Wasabi connects to Bitcoin and to the network.'),
    },
    InputSpec.of({
      managesettings: Value.toggle({
        name: i18n('Apply Settings On Startup'),
        description: i18n(
          'Disable to manage the server and proxy settings inside Wasabi instead. While enabled, the settings below are re-applied every time the service starts.',
        ),
        default: true,
      }),
      server: Value.dynamicUnion(async ({ effects }) => ({
        name: i18n('Bitcoin Node'),
        description: i18n('The Bitcoin node Wasabi fetches blocks from.'),
        default: (await effects.getInstalledPackages()).includes('bitcoind')
          ? 'bitcoind'
          : 'none',
        disabled: false,
        variants: Variants.of({
          bitcoind: {
            name: i18n('Local Node (recommended)'),
            spec: InputSpec.of({}),
          },
          none: {
            name: i18n('None (not recommended)'),
            spec: InputSpec.of({}),
          },
        }),
      })),
      useTor: Value.toggle({
        name: i18n('Use Tor'),
        description: i18n("Route Wasabi's own traffic over the Tor network."),
        default: true,
      }),
      rpc: Value.object(
        {
          name: i18n('JSON-RPC Server'),
          description: i18n(
            "Wasabi's JSON-RPC API, for driving wallets programmatically.",
          ),
        },
        InputSpec.of({
          enable: Value.toggle({
            name: i18n('Enable JSON-RPC'),
            description: i18n(
              'Publishes a JSON-RPC interface protected by the credentials below.',
            ),
            default: false,
          }),
          username: Value.text({
            name: i18n('JSON-RPC Username'),
            description: i18n('The username for the JSON-RPC server.'),
            required: true,
            default: 'wasabi',
            placeholder: '',
            patterns: [utils.Patterns.ascii],
          }),
          password: Value.text({
            name: i18n('JSON-RPC Password'),
            description: i18n('The password for the JSON-RPC server.'),
            required: true,
            generate: { charset: 'a-z,0-9', len: 20 },
            default: { charset: 'a-z,0-9', len: 20 },
            placeholder: '',
            masked: true,
            minLength: 8,
          }),
        }),
      ),
    }),
  ),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Settings'),
    description: i18n('Desktop credentials and Bitcoin connection settings'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => readSettings(effects),

  // the execution function
  ({ effects, input }) => writeSettings(effects, input),
)

type InputSpec = typeof inputSpec._TYPE
type PartialInputSpec = typeof inputSpec._PARTIAL

async function readSettings(effects: T.Effects): Promise<PartialInputSpec> {
  let settings = await store.read().once()
  if (!settings) {
    await createDefaultStore(effects)
    settings = (await store.read().once())!
  }

  return {
    title: settings.title,
    username: settings.username,
    password: settings.password,
    wasabi: {
      managesettings: settings.wasabi.managesettings,
      server: { selection: settings.wasabi.server.type },
      useTor: settings.wasabi.useTor,
      rpc: {
        enable: settings.wasabi.rpc.enable,
        username: settings.wasabi.rpc.username,
        password: settings.wasabi.rpc.password,
      },
    },
  }
}

async function writeSettings(effects: T.Effects, input: InputSpec) {
  await store.merge(effects, {
    title: input.title,
    username: input.username,
    password: input.password,
    wasabi: {
      managesettings: input.wasabi.managesettings,
      server: { type: input.wasabi.server.selection },
      useTor: input.wasabi.useTor,
      rpc: {
        enable: input.wasabi.rpc.enable,
        username: input.wasabi.rpc.username,
        password: input.wasabi.rpc.password,
      },
    },
  })
}
