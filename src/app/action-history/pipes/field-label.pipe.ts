import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'fieldLabel',
})
export class FieldLabelPipe implements PipeTransform {
	private readonly upperCaseLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM';

	transform(fieldName: string): string {
		let value = '';

		for (let i = 0; i < fieldName.length; i++) {
			const symbol = fieldName[i];

			if (i === 0) {
				value += symbol.toUpperCase();

				continue;
			}

			if (fieldName.length - 1 > i) {
				const nextSymbol = fieldName[i + 1];
				const isUpperCase = this.upperCaseLetters.includes(symbol);
				if ((isUpperCase && !this.upperCaseLetters.includes(nextSymbol))) {
					value += ` ${symbol.toLowerCase()}`;

					continue;
				}
			}

			value += symbol;
		}

		return value;
	}
}
