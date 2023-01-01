import { Pipe, PipeTransform } from '@angular/core';
import { ISecurityStatusInfo } from '../interfaces/security-status-info';

@Pipe({
	name: 'passwordStatusInfo',
})
export class PasswordStatusInfoPipe implements PipeTransform {
	transform(value: boolean | null): ISecurityStatusInfo {
		if (value) {
			return {
				icon: 'key',
				value,
				label: 'password',
				tooltip: 'Password is set',
			};
		}

		return {
			icon: 'key_off',
			value: false,
			label: 'no password',
			tooltip: 'Password is not set',
		};
	}
}
