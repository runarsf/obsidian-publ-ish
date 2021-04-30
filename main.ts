import {
  App,
  Modal,
  addIcon,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  ButtonComponent,
  FuzzySuggestModal,
  FileSystemAdapter,
} from "obsidian";
import { paperplaneIcon, verifyURIRegex } from "src/constants";
import 'path';
import 'fs';
import simpleGit, {
  FileStatusResult,
  SimpleGit,
  SimpleGitOptions,
} from "simple-git";

// https://github.com/denolehov/obsidian-git/blob/master/main.ts

interface PublishSettings {
  backendURL: string;
  commitMessage: string;
}

const DEFAULT_SETTINGS: PublishSettings = {
  backendURL: '',
  commitMessage: ''
}

export default class Publish extends Plugin {
  settings: PublishSettings;
  git: SimpleGit;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "get-process-cwd",
      name: "Get Process CWD",
      callback: () => {
        new Notice(process.cwd());
      },
    });

    this.addCommand({
      id: "open-publish-modal",
      name: "Open Publish Modal",
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new PublishModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });

    this.addCommand({
      id: "publish-list-changed-files",
      name: "List modified files",
      callback: async () => {
        const status = await this.git.status();
        //new ChangedFilesModal(this, status.files).open();
        let fileArray: string[] = [];
        status.files.forEach((file) => {
          fileArray.push(file.path);
        });
        new Notice(fileArray.join(", "));
      },
    });

    this.addSettingTab(new PublishSettingTab(this.app, this));
  }

  async init(): Promise<void> {
    try {
      const adapter = this.app.vault.adapter as FileSystemAdapter;
      const path = adapter.getBasePath();

      const gitOptions: Partial<SimpleGitOptions> = {
        baseDir: path,
        binary: "git",
        maxConcurrentProcesses: 6,
      };
      this.git = simpleGit(gitOptions);

      const isValidRepo = await this.git.checkIsRepo();

      if (!isValidRepo) {
        new Notice("Valid git repository not found.");
      }
    } catch (error) {
      new Notice(error);
      console.error(error);
    }
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
    const { contentEl, titleEl } = this;

    titleEl.setText("Publish");
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
      text: "bruh"
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
    let { contentEl } = this;
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
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Obsidian Publ-ish — Settings" });

    new Setting(containerEl)
      .setName("Backend URL")
      .setDesc("The location of your backend.")
      .addText((text) =>
        text
          .setPlaceholder("https://publish.domain.tld/api")
          .setValue(this.plugin.settings.backendURL)
          .onChange(async (backendURL) => {
            // TOOD: Verify and sanitize the URL
            const uriRegex = new RegExp(verifyURIRegex);
            if (uriRegex.test(backendURL)) {
              //new Notice("Applied backend URL: " + backendURL);
              this.plugin.settings.backendURL = backendURL;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Commit Message")
      .setDesc("The format of the commit message.")
      .addText((text) =>
        text
          .setPlaceholder("modified published notes")
          .setValue(this.plugin.settings.commitMessage)
          .onChange(async (commitMessage) => {
              this.plugin.settings.commitMessage = commitMessage;
              await this.plugin.saveSettings();
          })
      );
  }
}
