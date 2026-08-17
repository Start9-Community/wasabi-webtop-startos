import { config } from '../actions/config'
import { store } from '../fileModels/store.yaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const configureDefaultSettings = sdk.setupOnInit(
  async (effects, kind) => {
    if (kind !== 'install') return
    if (await store.read().once()) return

    await sdk.action.createOwnTask(effects, config, 'critical', {
      reason: i18n('Choose a username and password for the desktop'),
    })
  },
)
