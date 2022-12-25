import { Pipe, PipeTransform } from '@angular/core';
import { NOT_MAINNET_CHAIN_IDS } from '../constants';

@Pipe({
	name: 'isNotMainnetNetwork'
})
export class IsNotMainnetNetworkPipe implements PipeTransform {
	transform(chainId: string): boolean {
		return NOT_MAINNET_CHAIN_IDS.includes(chainId);
	}
}
