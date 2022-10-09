import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { PERSONAL_SETTINGS_MANAGER, PersonalSettingsManager } from '../data-provider/personal-settings.manager';
import { ThemeSwitcher } from '../../layout/services/theme.switcher';

@Injectable({
	providedIn: 'root',
})
export class AppInitializer {
	readonly renderer: Renderer2;

	constructor(rendererFactory: RendererFactory2,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManager: PersonalSettingsManager,
				private readonly themeSwitcher: ThemeSwitcher) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	async initialize(): Promise<void> {
		const theme = await this.personalSettingsManager.getLayoutState().toPromise().then(state => state.theme);

		this.themeSwitcher.setTheme(theme);
	}
}
