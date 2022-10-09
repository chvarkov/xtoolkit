import { Pipe, PipeTransform } from '@angular/core';
import { reverseTheme, Theme } from '../../core/data-provider/personal-settings.manager';

@Pipe({
  name: 'themeIcon'
})
export class ThemeIconPipe implements PipeTransform {

	transform(value?: Theme | null, reverse = true): string {
		if (!value) {
			value = Theme.Dark;
		}

		if (reverse) {
			value = reverseTheme(value);
		}

		return `${value}_mode`;
	}
}
