import { Plugin } from 'obsidian';
import SakanaWidget from "sakana-widget";

export default class SakanaWidgetPlugin extends Plugin {
	sakanaBoxEl: HTMLElement;
	sakanaEl: HTMLElement;
	sakanaWidget: SakanaWidget;

	async onload() {
		this.app.workspace.onLayoutReady(()=> this.addSakanaWidget());
	}

	private addSakanaWidget() {

		this.sakanaBoxEl = document.body.createEl('div', { attr: { id: 'sakana-widget-box' }, cls: 'sakana-widget-box' });
		this.sakanaEl = this.sakanaBoxEl.createEl('div', { attr: { id: 'sakana-widget' }, cls: 'sakana-widget' });
		this.sakanaWidget = new SakanaWidget({autoFit: true}).setState({ i: 0.03, d: 0.99,  }).mount('#sakana-widget');

	}

	onunload() {
		if(this.sakanaWidget) {
			this.sakanaWidget.unmount();
		}
		if(this.sakanaBoxEl) {
			this.sakanaBoxEl.detach();
		}
	}
}
