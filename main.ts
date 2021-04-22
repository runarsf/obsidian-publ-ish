import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';

interface PublishSettings {
  backendURL: string;
}

const DEFAULT_SETTINGS: PublishSettings = {
  backendURL: ''
}

export default class Publish extends Plugin {
  settings: PublishSettings;

  async onload() {
    console.log('loading plugin');

    await this.loadSettings();

    this.addRibbonIcon('dice', 'Sample Plugin', () => {
      new Notice('This is a notice!');
    });

    this.addStatusBarItem().setText('Status Bar Text');

    this.addCommand({
      id: 'open-sample-modal',
      name: 'Open Publish Modal',
      // callback: () => {
      //   console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new PublishModal(this.app).open();
          }
          return true;
        }
        return false;
      }
    });

    this.addSettingTab(new PublishSettingTab(this.app, this));

    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log('codemirror', cm);
    });

    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      console.log('click', evt);
    });

    this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

  onunload() {
    console.log('unloading publ-ish plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class PublishModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let {contentEl,titleEl} = this;
    titleEl.setText('Publish');
    contentEl.setText('Changes');
    let InitiateRepoButton = new ButtonComponent(vantageButtonsControlDiv)
  }

  onClose() {
    let {contentEl} = this;
    contentEl.empty();
  }
}

/*
 * Bare repos: https://github.com/runarsf/dotfiles/wiki#clone-existing-dotfiles
 * Modal example: https://github.com/ryanjamurphy/vantage-obsidian/blob/master/main.ts
 */

class PublishSettingTab extends PluginSettingTab {
  plugin: Publish;

  constructor(app: App, plugin: Publish) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: 'Obsidian Publi-ish — Settings'});

    new Setting(containerEl)
      .setName('Backend URL')
      .setDesc('The location of your backend.')
      .addText(text => text
        .setPlaceholder('https://publish.domain.tld/api')
        .setValue(this.plugin.settings.backendURL)
        .onChange(async (value) => {
          // TOOD: Verify and sanitize the URL
          console.log('Applied backend URL: ' + value);
          this.plugin.settings.backendURL = value;
          await this.plugin.saveSettings();
        }));
  }
}
