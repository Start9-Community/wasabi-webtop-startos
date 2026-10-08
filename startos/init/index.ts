import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { watchBitcoinRPCUsers } from './watchBitcoinRPCUsers'
import { configureDefaultSettings } from './configureDefaultSettings'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  dependencies,
  configureDefaultSettings,
  watchBitcoinRPCUsers,
)

export const uninit = sdk.setupUninit(versionGraph)
