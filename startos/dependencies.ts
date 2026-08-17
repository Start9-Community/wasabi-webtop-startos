import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'
import { otherConfig as bitcoinConfig } from 'bitcoin-core-startos/startos/actions/config/other'
import { i18n } from './i18n'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  const managesettings = conf?.wasabi.managesettings
  const serverType = conf?.wasabi.server.type
  if (managesettings && serverType == 'bitcoind') {
    await sdk.action.createTask(
      effects,
      'bitcoind',
      bitcoinConfig,
      'critical',
      {
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
      },
    )

    return {
      bitcoind: {
        kind: 'exists',
        versionRange: '>=28.4:14',
      },
    }
  }

  // clear request if not using bitcoind
  await sdk.action.clearTask(effects, 'request-compact-block-filters')

  return {}
})
