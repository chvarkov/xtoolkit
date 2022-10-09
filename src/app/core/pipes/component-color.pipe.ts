import { Pipe, PipeTransform } from '@angular/core';
import { ProjectComponentType } from '../types';

@Pipe({
	name: 'componentColor'
})
export class ComponentColorPipe implements PipeTransform {
	transform(value: ProjectComponentType): string {
		switch (value) {
			case 'project':
				return 'var(--default-component-color)';
			case 'abi':
				return 'var(--abi-color)';
			case 'sc':
				return 'var(--sc-color)';
			case 'token':
				return 'var(--token-color)';
			case 'wallet':
				return 'var(--wallet-color)';
			case 'nft':
				return 'var(--nft-color)';
			case 'tx':
				return 'var(--tx-color)';
			case 'group':
			case 'address_book':
			case 'home':
			case 'settings':
				return 'var(--text-color)';
		}
	}
}
