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
			case 'sc':
				return '#7effbd';
			case 'token':
				return '#fddf79';
			case 'wallet':
				return '#0FF0FF';
			case 'nft':
				return '#e37ef3';
			case 'group':
				return '#EDEDED';
		}
	}
}
