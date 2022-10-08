import { Pipe, PipeTransform } from '@angular/core';
import { ProjectComponentType } from '../types';

@Pipe({
	name: 'componentColor'
})
export class ComponentColorPipe implements PipeTransform {
	transform(value: ProjectComponentType): string {
		switch (value) {
			case 'project':
				return '#FFF';
			case 'abi':
				return '#f59664';
			case 'sc':
				return '#7effbd';
			case 'token':
				return '#fddf79';
			case 'wallet':
				return '#0FF0FF';
			case 'nft':
				return '#e37ef3';
			case 'tx':
				return '#73e775';
			case 'group':
			case 'address_book':
			case 'home':
				return 'var(--text-color)';
		}
	}
}
