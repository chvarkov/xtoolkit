import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { reverseTheme, Theme } from '../../core/data-provider/personal-settings.manager';

@Injectable({
	providedIn: 'root',
})
export class ThemeSwitcher {
	readonly renderer: Renderer2;

	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	async setTheme(theme: Theme): Promise<void> {
		this.renderer.addClass(document.body, this.getThemeClassName(theme));
		this.renderer.removeClass(document.body, this.getThemeClassName(reverseTheme(theme)));
	}

	private getThemeClassName(theme: Theme): string {
		return `${theme}-theme`;
	}
}
