import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NetworkSelector } from '../store/network.selector';
import { map } from 'rxjs/operators';

@Pipe({
	name: 'network'
})
export class NetworkPipe implements PipeTransform {
	constructor(private readonly store: Store) {
	}

	transform(chainId: string): Observable<string> {
		return this.store.select(NetworkSelector.networkByChainId(chainId)).pipe(
			map(network => network?.name || ''),
		);
	}
}
