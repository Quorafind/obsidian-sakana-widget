import SakanaWidget from 'component/wrapper';
import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface SakanaWidgetPluginSettings {
	widgets: SakanaWidgetInterface[];
	lastWidget: string;
}

const DEFAULT_SETTINGS: SakanaWidgetPluginSettings = {
	widgets: [],
	lastWidget: '',
}

export default class SakanaWidgetPlugin extends Plugin {
	sakanaBoxEl: HTMLElement | undefined;
	sakanaEl: HTMLElement;
	sakanaWidget: SakanaWidget | undefined;
	settings: SakanaWidgetPluginSettings;

	async onload() {

		// Register Settings Stuff
		await this.registerSettings();

		this.app.workspace.onLayoutReady(()=> this.addSakanaWidget());

		this.addCommand({
			id: 'show-sakana-widget',
			name: 'Show Sakana Widget',
			hotkeys: [],
			callback: () => {
				if(!this.sakanaBoxEl) {
					this.addSakanaWidget();
				}
			},
		});

		this.addCommand({
			id: 'hide-sakana-widget',
			name: 'Hide Sakana Widget',
			hotkeys: [],
			callback: () => {
				if(this.sakanaBoxEl) {
					this.detachSakanaWidget();
				}
			},
		});
	}

	private addSakanaWidget() {

		this.sakanaBoxEl = document.body.createEl('div', { attr: { id: 'sakana-widget-box' }, cls: 'sakana-widget-box' });
		this.sakanaEl = this.sakanaBoxEl.createEl('div', { attr: { id: 'sakana-widget' }, cls: 'sakana-widget' });

		this.sakanaWidget = new SakanaWidget({ character: this.settings.lastWidget ? this.settings.lastWidget : 'chisato' , autoFit: true }).setState({ i: 0.03, d: 0.99,  }).mount('#sakana-widget');

	}

	async onunload() {
		if(this.sakanaWidget) {
			await this.saveCurrentWidgetName();
			this.sakanaWidget.unmount();
		}
		if(this.sakanaBoxEl) {
			this.sakanaBoxEl.detach();
		}
	}

	async registerSettings() {
		await this.loadSettings();
		this.addSettingTab(new SakanaWidgetSettingTab(this.app, this));
		this.registerInterval(window.setTimeout(() => {
				this.saveSettings();
			}, 100)
		);
	}

	async saveCurrentWidgetName() {
		const lastCharacter = this.sakanaWidget;
		if (lastCharacter) {
			this.settings.lastWidget = lastCharacter._char;
			await this.saveSettings();
		}
	}

	async detachSakanaWidget() {
		if (this.sakanaBoxEl) {
			await this.saveCurrentWidgetName();

			this.sakanaBoxEl.detach();
			this.sakanaBoxEl = undefined;
			this.sakanaWidget = undefined;
		}
	}

	loadSakanaWidgets() {
		if(this.settings.widgets.length > 0) {
			this.settings.widgets.forEach((widget) => {
				const selfWidget = SakanaWidget.getCharacter('chisato');
				if (selfWidget) selfWidget.image = widget.url;
				if (selfWidget) SakanaWidget.registerCharacter(widget.name, selfWidget);
			});
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.loadSakanaWidgets();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SakanaWidgetSettingTab extends PluginSettingTab {
	plugin: SakanaWidgetPlugin;
	private applyDebounceTimer: number = 0;

	constructor(app: App, plugin: SakanaWidgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	applySettingsUpdate() {
		clearTimeout(this.applyDebounceTimer);
		const plugin = this.plugin;
		this.applyDebounceTimer = window.setTimeout(() => {
			plugin.saveSettings();
		}, 100);
	}


	display(): void {
		const { containerEl } = this;
		const { settings } = this.plugin;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Table Generator' });

		new Setting(containerEl)
			.setName('Add new widget')
			.setDesc('Create a new widget to play with ~ 🐟')
			.addButton((button) => button
				.setButtonText('+')
				.onClick(async () => {
					settings.widgets.push({
						name: `Widget ${settings.widgets.length + 1}`,
						url: "",
					});
					this.applySettingsUpdate();
					this.display();
				}));

		this.displayMacroSettings();

		this.containerEl.createEl('h2', { text: 'Say Thank You' });

		new Setting(containerEl)
			.setName('Donate')
			.setDesc('If you like this plugin, consider donating to support continued development:')
			.addButton((bt) => {
				bt.buttonEl.outerHTML = `<a href="https://cdn.jsdelivr.net/gh/Quorafind/.github@main/IMAGE/%E5%BE%AE%E4%BF%A1%E4%BB%98%E6%AC%BE%E7%A0%81.jpg"><svg t="1665812123945" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6483" width="48" height="48"><path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" p-id="6484" fill="#886ce4"></path></svg></a>`;
			})
			.addButton((bt) => {
				bt.buttonEl.outerHTML = `<a href="https://cdn.jsdelivr.net/gh/Quorafind/.github@main/IMAGE/%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BB%98%E6%AC%BE%E7%A0%81.jpg"><svg t="1665811211401" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5063" width="48" height="48"><path d="M1024.0512 701.0304V196.864A196.9664 196.9664 0 0 0 827.136 0H196.864A196.9664 196.9664 0 0 0 0 196.864v630.272A196.9152 196.9152 0 0 0 196.864 1024h630.272a197.12 197.12 0 0 0 193.8432-162.0992c-52.224-22.6304-278.528-120.32-396.4416-176.64-89.7024 108.6976-183.7056 173.9264-325.3248 173.9264s-236.1856-87.2448-224.8192-194.048c7.4752-70.0416 55.552-184.576 264.2944-164.9664 110.08 10.3424 160.4096 30.8736 250.1632 60.5184 23.1936-42.5984 42.496-89.4464 57.1392-139.264H248.064v-39.424h196.9152V311.1424H204.8V267.776h240.128V165.632s2.1504-15.9744 19.8144-15.9744h98.4576V267.776h256v43.4176h-256V381.952h208.8448a805.9904 805.9904 0 0 1-84.8384 212.6848c60.672 22.016 336.7936 106.3936 336.7936 106.3936zM283.5456 791.6032c-149.6576 0-173.312-94.464-165.376-133.9392 7.8336-39.3216 51.2-90.624 134.4-90.624 95.5904 0 181.248 24.4736 284.0576 74.5472-72.192 94.0032-160.9216 150.016-253.0816 150.016z" p-id="5064" fill="#886ce4"></path></svg></a>`;
			})
			.addButton((bt) => {
				bt.buttonEl.outerHTML = `<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Coffee&emoji=&slug=boninall&button_colour=886ce4&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00"></a>`;
			});
	}

	displayMacroSettings(): void {
		const { containerEl } = this;
		const { settings } = this.plugin;

		settings.widgets.forEach((widget, index) => {
			const topLevelSetting = new Setting(containerEl)
				.setClass('widget-setting')
				.setName(`SakanaWidget #${index + 1}`)
				.addButton((button) => button
					.setButtonText('Delete Widget')
					.onClick(async () => {
						settings.widgets.splice(index, 1);
						this.applySettingsUpdate();
						this.display();
					}));

			const mainSettingsEl = topLevelSetting.settingEl.createEl('div', 'widget-main-settings');

			mainSettingsEl.createEl('label', { text: 'Widget Name' });
			mainSettingsEl.createEl('input', {
				cls: 'name-input',
				type: 'text',
				value: widget.name,
			}).on('change', '.name-input', async (evt: Event) => {
				const target = evt.target as HTMLInputElement;
				settings.widgets[index] = { ...widget, name: target.value };
				this.applySettingsUpdate();
			});

			mainSettingsEl.createEl('label', { text: 'Url Link' });
			mainSettingsEl.createEl('input', {
				cls: 'url-input',
				type: 'text',
				value: widget.url,
			}).on('change', '.url-input', async (evt: Event) => {
				const target = evt.target as HTMLInputElement;
				settings.widgets[index] = { ...widget, url: target.value };
				this.applySettingsUpdate();
			});
		});
	}
}
