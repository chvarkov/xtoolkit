import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'decodeBase64'
})
export class DecodeBase64Pipe implements PipeTransform {

	transform(value: string): string {
		try {
			return Buffer.from(value, 'base64').toString('utf8');
		} catch (e) {
			return value;
		}
	}
}
