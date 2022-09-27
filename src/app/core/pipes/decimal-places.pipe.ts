import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
	name: 'decimalPlaces'
})
export class DecimalPlacesPipe implements PipeTransform {
	transform(value: BigNumber.Value, decimals = 18): string {
		return new BigNumber(value).toFormat(decimals);
	}
}
