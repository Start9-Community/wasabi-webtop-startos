import { SubContainerEager, T } from '@start9labs/start-sdk'
import crypto from 'crypto'
import * as fs from 'node:fs/promises'

// uiPort
export const uiPort = 3000

// generateRpcPassword
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRpcPassword = (len = 20) =>
  Array.from(crypto.randomBytes(len))
    .map((b) => chars[b % chars.length])
    .join('')

/*
 * Checks if a file exists at the given path in the subcontainer.
 * If it does not exist, it copies the file from the source path to the destination path.
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
  } catch {
    await subcontainer.exec([
      'sh',
      '-c',
      `mkdir -p $(dirname ${dest}) && cp ${src} ${dest}`,
    ])
  }
}

/*
 * Removes the UTF-8 BOM character from the beginning of a file.
 * @param subcontainer - The subcontainer in which the file resides.
 * @param filePath - The path to the file from which to remove the BOM character.
 */
export async function removeUtf8BOMCharacter<
  Manifest extends T.SDKManifest,
  Effects extends T.Effects,
>(subcontainer: SubContainerEager<Manifest, Effects>, filePath: string) {
  await subcontainer.exec(['sed', '-i', `1s/^\uFEFF//`, filePath])
}
