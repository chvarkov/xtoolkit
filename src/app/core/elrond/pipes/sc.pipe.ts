import { Pipe, PipeTransform } from '@angular/core';
import { AbiJson, ScBuilder } from '../builders/sc.builder';
import { SmartContract } from '@elrondnetwork/erdjs/out';

@Pipe({
	name: 'sc'
})
export class ScPipe implements PipeTransform {
	transform(value: AbiJson, address: string): SmartContract {
		return ScBuilder.build(address, value);
	}
}
