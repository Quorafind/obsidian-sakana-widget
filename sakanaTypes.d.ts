interface SakanaWidgetInterface {
	name: string,
	url: string,
}

declare module "obsidian" {
	interface App {
		plugins: {
			enabledPlugins: Set<string>;
			plugins: {
				[id: string]: any;
			};
		}
	}
}
