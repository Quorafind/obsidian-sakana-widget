import { Plugin } from 'obsidian';
import SakanaWidget from "sakana-widget";

export default class MyPlugin extends Plugin {
	component: HTMLElement;
	widget: SakanaWidget;

	async onload() {
		this.app.workspace.onLayoutReady(()=> this.addSakanaWidget());
	}

	private addSakanaWidget() {
		this.component = document.createElement('div') as HTMLElement;
		this.component.setAttribute("id", "sakana-widget");
		this.component.className = "sakana-widget-box";

		document.body.appendChild(this.component);

		this.widget = new SakanaWidget({autoFit: true}).setState({ i: 0.03, d: 0.99,  }).mount('#sakana-widget');
	}

	onunload() {
		if(this.component) {
			this.widget.unmount();
		}
		if(document.querySelector('#sakana-widget')) {
			document.querySelector('#sakana-widget')?.detach();
		}
	}
}
