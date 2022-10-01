import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'shortString',
})
export class ShortStringPipe implements PipeTransform {
	transform(value: string, maxLength?: number, separator = '...'): string {
		if (maxLength == null) {
			return value;
		}

		if (value.length <= maxLength) {
			return value;
		}

		const part = Math.floor(maxLength - separator.length / 2);

		return [
			value.substring(0, part),
			value.substring(value.length - part, value.length),
		].join(separator);
	}
}
