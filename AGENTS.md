# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **The image is built elsewhere and this repo only pulls it.** `ghcr.io/remcoros/wasabi-webtop` is built from <https://github.com/remcoros/wasabi-webtop>, which owns the Dockerfile, the LinuxServer-style `/root` overlay, the openbox config, and the `/defaults/.walletwasabi` seed files this package copies at startup. There is no Dockerfile here, so nothing in this repo can change what is inside the container — a change to the desktop, the autostart script, or the seed config is a PR against that repo and a new tag here.
- **Two volumes, and only one of them holds the wallet.** `userdir` is `/config`, the desktop user's home, and everything Wasabi owns lives under `/config/.walletwasabi` — keys, wallet files, coin labels. `main` holds nothing but this package's own `start9/config.yaml`. Both are backed up; never move wallet state off `userdir`.
- **`bitcoin-core-startos` is imported as a value, not just a type.** `otherConfig` and `generateRpcUserDependent` are Action objects, so their input specs ship inside `javascript.squashfs`. Read the `package-lock.json` diff of a sibling bump as code review, not a version bump, and keep the pin's line (`next/28.x`) matching the `versionRange` floor in `startos/dependencies.ts`.
- **Bitcoin's `generate-rpc-dependent` action enforces `minLength: 20` on the password and renders it read-only.** A credential we generate shorter than that produces a critical task the user cannot complete. `rpcPasswordLength` in `startos/utils.ts` is that floor; `watchBitcoinRPCUsers` rotates a below-floor password before raising the task rather than after.
- **The image seeds `Config.json` with the wrong schema number, and Wasabi's response is to throw the file away.** It claims `ConfigVersion: 3` while its body is a valid schema 4. Wasabi's schema-3 decoder requires a `BackendUri` the seed omits and its schema-4 decoder refuses anything not labelled 4, so every decoder in `PersistentConfigManager.LoadFile`'s `OneOf` fails, the catch-all fires, and it writes `DefaultMainNetConfig` over the top — discarding the Bitcoin RPC settings and leaving the wallet syncing over public peers with a green health check. `main.ts` relabels the seed to `wasabiConfigVersion`; **re-check that constant against upstream on every version bump**, since a real schema 5 with a real migration must not be relabelled away.
- **Wasabi's config has no `UseBitcoinRpc` flag.** That key was dropped in 2.8.0; a non-empty `BitcoinRpcEndPoint` is what enables RPC, and it must be an **absolute URI** (`http://host:port`) — a bare `host:port` is what upstream's own migration treats as unconfigured.
