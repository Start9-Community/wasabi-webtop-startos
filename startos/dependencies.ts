import { otherConfig as bitcoinConfig } from 'bitcoin-core-startos/startos/actions/config/other'
import { store } from './fileModels/store.yaml'
import { i18n } from './i18n'
import { sdk } from './sdk'

const bitcoind = sdk.Dependency.optional('bitcoind', {
  description: {
    en_US: 'Used to fetch blocks and broadcast transactions privately.',
    es_ES:
      'Se utiliza para obtener bloques y transmitir transacciones de forma privada.',
    de_DE:
      'Wird verwendet, um Blöcke abzurufen und Transaktionen privat zu senden.',
    pl_PL: 'Używany do pobierania bloków i prywatnego rozgłaszania transakcji.',
    fr_FR:
      'Utilisé pour récupérer les blocs et diffuser les transactions de manière privée.',
  },
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  versionRange:
    '(>=28.4:29 && <29) || (>=29.4:16 && <30) || (>=30.3:16 && <31) || >=31.1:16 || >=#knotsprerdts:29.3:29',
  kind: 'exists',
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return (
      !!conf?.wasabi.managesettings && conf.wasabi.server.type === 'bitcoind'
    )
  },
}).withInit(async (effects) => {
  await sdk.action.createTask(effects, 'bitcoind', bitcoinConfig, 'critical', {
    replayId: 'request-compact-block-filters',
    when: {
      condition: 'input-not-matches',
      once: false,
    },
    reason: i18n('Enable Compact Block Filters (BIP158) in Bitcoin'),
    input: {
      kind: 'partial',
      accept: [
        {
          blockfilters: {
            blockfilterindex: true,
          },
        },
      ],
      set: {
        blockfilters: {
          blockfilterindex: true,
        },
      },
    },
  })
})

export const dependencies = sdk.Dependencies.of().addDependency(bitcoind)
