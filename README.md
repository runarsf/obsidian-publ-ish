## Obsidian Publ-ish

A ripoff of Obsidian Publish for poor people who want to selectively self-host their notes.
A backend + frontend will be provided later. This is just a (not currently working) PoC.
This is my first interaction with TypeScript, so the project is subject to shitty code. I am also a cheap bugger, so I haven’t tested it on mobile.

### How to use

- Clone this repo ([Manual installation](https://github.com/runarsf/obsidian-publ-ish/#manual-installation)).
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start TypeScript compilation in watch mode (don't modify `.js` files).
- Reload Obsidian to load the new version of your plugin.

### Manual installation

- Clone the repository into the vault plugins directory `git clone https://github.com/runarsf/obsidian-publ-ish VaultFolder/.obsidian/plugins`

### API "Documentation"

See https://github.com/obsidianmd/obsidian-api

## Todo

- [ ] Use git bare repos? This would make it more platform-agnostic. Maybe send a signal to the backend that it should update
- [ ] Support #published tag to auto-publish (in yaml header)
