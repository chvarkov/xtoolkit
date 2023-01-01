import { Pipe, PipeTransform } from '@angular/core';
import { ISecurityStatusInfo } from '../interfaces/security-status-info';

@Pipe({
	name: 'secretsLockedStatusInfo',
})
export class SecretsLockedStatusInfoPipe implements PipeTransform {
	transform(value: boolean | null): ISecurityStatusInfo {
		if (value) {
			return {
				icon: 'lock',
				value,
				label: 'locked',
				tooltip: 'Secrets locked',
			};
		}

		return {
			icon: 'lock_open',
			value: false,
			label: 'unlocked',
			tooltip: 'Secrets unlocked',
		};
	}
}
