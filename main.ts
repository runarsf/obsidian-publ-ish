import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';
//import 'nodegit';
import 'path';
import 'fs';

// https://github.com/reuseman/flashcards-obsidian/blob/main/src/constants.ts
export const flashcardsIcon = `<path fill="currentColor" stroke="currentColor" d="m98.69029,0.55335l-54.30674,0a1.1128,1.14693 0 0 0 -1.1128,1.15682l0,26.36956l-42.32491,14.67282a1.1128,1.14693 0 0 0 -0.7003,1.45344c0.09593,0.30651 9.89052,30.40359 13.18097,40.38981c2.6573,8.05819 2.20642,13.55555 2.19683,13.61488a1.1128,1.14693 0 0 0 0.4221,0.98873a1.08402,1.11727 0 0 0 0.69071,0.24718a1.10321,1.13704 0 0 0 0.35495,-0.05932l51.47676,-17.79722a1.1224,1.15682 0 0 0 0.75786,-0.98873c0,-0.2373 0.58518,-5.71489 -2.16805,-14.14879c-0.62355,-1.92803 -1.48694,-4.56795 -2.47503,-7.60337l34.00766,0a1.1128,1.14693 0 0 0 1.1224,-1.14693l0,-55.99205a1.1224,1.15682 0 0 0 -1.1224,-1.15682zm-31.55182,79.09878l-49.24156,17.02601a41.33682,42.60458 0 0 0 -2.35991,-12.85355c-2.87794,-8.86895 -11.02251,-33.73563 -12.81643,-39.25277l49.35668,-17.115c1.8131,5.53691 10.00564,30.65078 12.96032,39.70759a35.96466,37.06766 0 0 1 2.1009,12.48772zm30.43902,-23.07707l-33.65272,0c-4.25935,-13.03152 -10.08238,-30.9474 -10.08238,-30.9474a1.1224,1.15682 0 0 0 -1.41978,-0.72178l-6.91665,2.39274l0,-24.44152l52.07154,0l0,53.71796z"/>`

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

    this.addRibbonIcon('dice', 'Publ-ish', () => {
      new Notice('This is a notice!');
    });

    this.addStatusBarItem().setText('uwu');

    this.addCommand({
      id: 'open-publish-modal',
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
    //let publishPlugin = this.app.plugins.getPlugin("obsidian-publ-ish")

    titleEl.setText('Publish');
    let publishSettingsDiv = contentEl.createEl("div");

    let publishStatusHeadingDiv = contentEl.createEl("h4", {
      text: "Publish status",
    });
    publishStatusHeadingDiv.addClass("setting-item");
    publishStatusHeadingDiv.addClass("setting-item-heading");
    publishSettingsDiv.append(publishStatusHeadingDiv);

    /*
    let unstagedChangesDiv = contentEl.createEl("div");
        unstagedChangesDiv.addClass("setting-item");
    let unstagedChangesInfoDiv = contentEl.createEl("div");
        unstagedChangesInfoDiv.addClass("setting-item-info");
    let unstagedChangesControlDiv = contentEl.createEl("div");
        unstagedChangesControlDiv.addClass("setting-item-control");
    let unstagedChangesText = contentEl.createEl("span", {
      text: "Unstaged items:",
    });
        unstagedChangesText.addClass("setting-item-name");
    let unstagedChangesInput = contentEl.createEl("input", { type: "text" });
    //noteTitleContainsInput.setAttr("style", "float: right; width: 50%");
    unstagedChangesInfoDiv.append(unstagedChangesText);
    unstagedChangesControlDiv.append(unstagedChangesInput);
    unstagedChangesDiv.append(unstagedChangesInfoDiv);
    unstagedChangesDiv.append(unstagedChangesControlDiv);
    publishSettingsDiv.append(unstagedChangesDiv);
    */

    let unstagedDiv = contentEl.createEl("div");
        unstagedDiv.addClass("setting-item");
    let unstagedDetails = contentEl.createEl("details", {
      text: "Unchanged",
    });
    let unstagedSummary = contentEl.createEl("summary", {
      text: "Unchanged (select to unpublish)",
    });
    unstagedDetails.append(unstagedSummary);
    unstagedDiv.append(unstagedDetails);
    publishSettingsDiv.append(unstagedDiv);

    let modifiedDiv = contentEl.createEl("div");
    let modifiedDetails = contentEl.createEl("details", {
      text: "Modified published files",
    });
    let modifiedSummary = contentEl.createEl("summary", {
      text: "Published files - modified",
    });
    modifiedDetails.append(modifiedSummary);
    modifiedDiv.append(modifiedDetails);
    publishSettingsDiv.append(modifiedDiv);

    /*let publishStatusHeadingDiv = contentEl.createEl("h2", {
      text: "Publish status",
    });*/

    /*let publishButtonControlDiv = contentEl.createEl('div');
    let initializeRepoButton = new ButtonComponent(publishButtonControlDiv)
      .setButtonText("Publish")
      .onClick(function () {
        new Notice('Hi');
        this.fancyShit = (this.app.workspace.activeLeaf);
      });
      */

  }

  onClose() {
    let {contentEl} = this;
    contentEl.empty();
  }
}

/*
 * Bare repos: https://github.com/runarsf/dotfiles/wiki#clone-existing-dotfiles
 * Modal example: https://github.com/ryanjamurphy/vantage-obsidian/blob/master/main.ts
 * NodeGit example: https://github.com/nodegit/nodegit/blob/master/examples/create-new-repo.js
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

    containerEl.createEl('h2', {text: 'Obsidian Publ-ish — Settings'});

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
