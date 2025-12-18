import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, 'main')
  const uiOrigin = await multi.bindPort(uiPort, {
    protocol: 'http',
    addSsl: { addXForwardedHeaders: true },
  })

  const ui = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'ui',
    description: 'Web Interface',
    type: 'ui',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiOrigin.export([ui])
  const receipts = [uiReceipt]

  const jsonRpcServerEnabled = await store
    .read((f) => f.wasabi.rpc.enable)
    .const(effects)
  if (jsonRpcServerEnabled) {
    const rpcOrigin = await multi.bindPort(37128, {
      protocol: 'http',
      addSsl: { addXForwardedHeaders: true },
    })
    const rpc = sdk.createInterface(effects, {
      name: 'JSON-RPC',
      id: 'rpc',
      description: 'JSON-RPC Interface',
      type: 'api',
      schemeOverride: null,
      masked: false,
      username: null,
      path: '',
      query: {},
    })

    const rpcReceipt = await rpcOrigin.export([rpc])
    receipts.push(rpcReceipt)
  }

  return receipts
})
