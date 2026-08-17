import { SubContainerEager, T } from '@start9labs/start-sdk'
import crypto from 'crypto'
import * as fs from 'node:fs/promises'

export const uiPort = 3000
export const jsonRpcPort = 37128

// The schema version Wasabi writes. The image seeds Config.json claiming 3 while
// its body is already a valid 4, and Wasabi has no decoder that accepts the
// mismatch — so main.ts relabels the seed. Re-check this against
// PersistentConfigManager.DefaultMainNetConfig on every upstream bump.
export const wasabiConfigVersion = 4

// Bitcoin's `generate-rpc-dependent` action rejects anything shorter, and it
// renders the dependent-supplied value read-only, so the user cannot correct it.
export const rpcPasswordLength = 20

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRpcPassword = (len = rpcPasswordLength) =>
  Array.from(crypto.randomBytes(len))
    .map((b) => chars[b % chars.length])
    .join('')

export const generateRpcUsername = () => 'wasabi_' + generateRpcPassword(6)

/**
 * Copies `src` to `dest` inside the subcontainer unless `dest` already exists.
 * Returns whether it created the file.
 */
export async function ensureFileExists<
  Manifest extends T.SDKManifest,
  Effects extends T.Effects,
>(
  subcontainer: SubContainerEager<Manifest, Effects>,
  src: string,
  dest: string,
) {
  const destPath = `${subcontainer.rootfs}${dest}`
  try {
    await fs.access(destPath, fs.constants.F_OK)
    return false
  } catch {
    await subcontainer.exec([
      'sh',
      '-c',
      `mkdir -p $(dirname ${dest}) && cp ${src} ${dest}`,
    ])
    return true
  }
}

/**
 * Strips a leading UTF-8 BOM, which Wasabi writes and the JSON file models
 * cannot parse. Call it before every `merge` — and only ever `merge` those
 * files: the models declare a handful of keys out of dozens, so a `write`
 * would be a data-loss bug.
 */
export async function removeUtf8BOMCharacter<
  Manifest extends T.SDKManifest,
  Effects extends T.Effects,
>(subcontainer: SubContainerEager<Manifest, Effects>, filePath: string) {
  await subcontainer.exec(['sed', '-i', `1s/^\uFEFF//`, filePath])
}
