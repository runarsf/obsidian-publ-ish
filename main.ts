import { App, Modal, addIcon, Notice, Plugin, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';
import { paperplaneIcon } from 'src/constants';
import 'path';
import 'fs';
import simpleGit, { FileStatusResult, SimpleGit } from "simple-git";

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

    this.addStatusBarItem().setText('uwu');

    this.addCommand({
      id: 'open-publish-modal',
      name: 'Open Publish Modal',
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
    const {contentEl,titleEl} = this;

    titleEl.setText('Publish');
    const publishSettingsDiv = contentEl.createEl("div");

    const publishStatusHeadingDiv = contentEl.createEl("h4", {
      text: "Publish status",
    });
    publishStatusHeadingDiv.addClass("setting-item");
    publishStatusHeadingDiv.addClass("setting-item-heading");
    publishSettingsDiv.append(publishStatusHeadingDiv);

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
  }

  onClose() {
    let {contentEl} = this;
    contentEl.empty();
  }
}

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
