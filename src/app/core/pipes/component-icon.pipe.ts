import { Pipe, PipeTransform } from '@angular/core';
import { ProjectComponentType } from '../types';

@Pipe({
	name: 'componentIcon'
})
export class ComponentIconPipe implements PipeTransform {
	transform(value: ProjectComponentType): string {
		switch (value) {
			case 'project':
				return 'folder_copy';
			case 'sc':
				return 'code';
			case 'token':
				return 'token';
			case 'wallet':
				return 'account_balance_wallet';
			case 'nft':
				return 'photo_library';
			case 'group':
				return 'folder';
		}
	}
}
