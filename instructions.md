# Wasabi Wallet

Wasabi is a desktop application, not a web app. What you open in your browser is a real Linux desktop running the real Wasabi — so anything you do inside it, including creating a wallet and writing down its recovery words, happens on your server rather than on the machine you are sitting at.

## Documentation

- [Wasabi documentation](https://docs.wasabiwallet.io/) — the official user guide.
- [Wasabi FAQ](https://docs.wasabiwallet.io/FAQ/) — answers to the questions most people have first.
- [Coinjoin](https://docs.wasabiwallet.io/using-wasabi/CoinJoin.html) — how Wasabi's privacy feature works and what it costs.
- [Using a Bitcoin full node](https://docs.wasabiwallet.io/using-wasabi/BitcoinFullNode.html) — what changes when Wasabi talks to your own node.
- [JSON-RPC reference](https://docs.wasabiwallet.io/using-wasabi/RPC.html) — the commands available over the RPC interface.

## What you get on StartOS

- **The full Wasabi desktop in your browser.** The wallet, its settings, and its coinjoin features are all the real application, unchanged.
- **A connection to your own Bitcoin node**, set up for you. Wasabi fetches blocks and broadcasts your transactions through your node rather than someone else's.
- **Wallets that stay on your server**, backed up along with everything else on it.

## Getting set up

1. Open **Settings** and choose a username and password for the desktop, or keep the generated ones. Pick **Local Node** if you want Wasabi to use your own Bitcoin node — install Bitcoin first if you have not already.
2. If you chose **Local Node**, Wasabi will ask Bitcoin for two things, and both requests appear on **Bitcoin's** page rather than this one: permission to connect, and the block filters Wasabi needs to find your transactions privately. Do both.
3. Start the service and open the **Web UI**. Your browser will ask for the username and password from step 1.
4. Inside Wasabi, create or recover a wallet as you normally would. **Write the recovery words down on paper** — they are the only way back to your money.

If Bitcoin has just turned on block filters, it needs time to build the index before Wasabi can scan with it. Wasabi will look stuck until that finishes.

## Using Wasabi

### The desktop

The Web UI is the whole desktop, not just Wasabi. Wasabi starts maximized and is the only thing you normally need; a file manager, a terminal and a text editor are also there if you want them. Closing the browser tab leaves the session running — reopening it puts you back where you were.

### Settings

**Settings** is where the desktop's username and password live, along with the choice of Bitcoin node, the Tor toggle, and the JSON-RPC server. Changes take effect the next time the service starts, so restart it afterwards.

While **Apply Settings On Startup** is on, this page owns Wasabi's connection settings — the Bitcoin node, the Tor setting and the RPC server — and rewrites them every time the service starts. If you would rather set those inside Wasabi itself, turn that toggle off and they are yours.

### Show UI Credentials

Shows the desktop's username and password, ready to copy. Use it if your browser has forgotten them.

### JSON-RPC

Turning on **Enable JSON-RPC** in Settings publishes a second interface for driving Wasabi from scripts, protected by the RPC username and password you set there. Most people do not need it.

## Limitations

- **USB devices are not available**, so hardware wallets — Coldcard, Trezor, Ledger and the rest — cannot be used here.
- **There is no camera**, so QR codes cannot be scanned. Paste addresses instead.
