import { App, Modal, addIcon, Notice, Plugin, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';
import { paperplaneIcon } from 'src/constants';
import 'path';
import 'fs';
//import 'nodegit';
//const Git = require("nodegit");
//import { Repository } from 'nodegit';
//import * as Git from "nodegit";
//import { CheckStatus } from './src/git';

// https://github.com/reuseman/flashcards-obsidian/blob/main/src/constants.ts
// https://github.com/Pseudonium/Obsidian_to_Anki/blob/master/main.ts

interface PublishSettings {
  backendURL: string;
}

const DEFAULT_SETTINGS: PublishSettings = {
  backendURL: ''
}

export default class Publish extends Plugin {
  settings: PublishSettings;

  async onload() {
    await this.loadSettings();

    /*await CheckStatus() /*.then((msg) => {
      new Notice();
    });*/
    
    /*
    addIcon('paperplane', paperplaneIcon);
    this.addRibbonIcon('paperplane', 'Publ-ish', () => {
      //new Notice('This is a notice!');
      await CheckStatus().then((msg) => {
        new Notice(msg);
      });
    });
    */

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

    /*
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log('codemirror', cm);
    });

    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      console.log('click', evt);
    });

    this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    */
  }

  /*onunload() {
    console.log('unloading publ-ish plugin');
  }*/

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
    const {contentEl,titleEl} = this;
    //let publishPlugin = this.app.plugins.getPlugin("obsidian-publ-ish")

    titleEl.setText('Publish');
    const publishSettingsDiv = contentEl.createEl("div");

    const publishStatusHeadingDiv = contentEl.createEl("h4", {
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

    const unstagedDiv = contentEl.createEl("div");
        unstagedDiv.addClass("setting-item");
    const unstagedDetails = contentEl.createEl("details", {
      text: "Unchanged",
    });
    const unstagedSummary = contentEl.createEl("summary", {
      text: "Unchanged (select to unpublish)",
    });
    unstagedDetails.append(unstagedSummary);
    unstagedDiv.append(unstagedDetails);
    publishSettingsDiv.append(unstagedDiv);

    const modifiedDiv = contentEl.createEl("div");
    const modifiedDetails = contentEl.createEl("details", {
      text: "Modified published files",
    });
    const modifiedSummary = contentEl.createEl("summary", {
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
