## Obsidian Publ-ish

A ripoff of Obsidian Publish for poor people who want to selectively self-host their notes.
This is currently just PoC and I will be expanding on it in the future. The notes will be published to a git repository using git bare repositories, this will let the user decide the "frontend" for the notes, like Jekyll.

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
