import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const WASABI_VERSION = '2.8.1'

export const current = VersionInfo.of({
  version: '2.8.1:2',
  releaseNotes: {
    en_US:
      'fix: on new installs, the minimum RPC password length must be at least 20 characters.',
    es_ES:
      'fix: en nuevas instalaciones, la longitud mínima de la contraseña RPC debe ser de al menos 20 caracteres.',
    de_DE:
      'fix: bei neuen Installationen muss die minimale RPC-Passwortlänge mindestens 20 Zeichen betragen.',
    pl_PL:
      'fix: przy nowych instalacjach minimalna długość hasła RPC musi wynosić co najmniej 20 znaków.',
    fr_FR:
      'fix: lors de nouvelles installations, la longueur minimale du mot de passe RPC doit être d\'au moins 20 caractères.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
