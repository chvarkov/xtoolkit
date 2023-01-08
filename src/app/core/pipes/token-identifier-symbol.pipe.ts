import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'tokenIdentifierSymbol',
	pure: true,
})
export class TokenIdentifierSymbolPipe implements PipeTransform {
	transform(value: string): string {
		return value.split('-')[0] || '';
	}
}
