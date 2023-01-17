import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'bytesToKb'
})
export class BytesToKbPipe implements PipeTransform {
	transform(value: number, decimals = 2): number {
		return +(value / 1024).toFixed(decimals);
	}
}
