import { createSelector } from '@ngrx/store';
import { INetworkState } from './network.reducer';
import { NetworkModule } from '../network.module';
import { INetworkEnvironment } from '../../core/interfaces/network-environment';

export class NetworkSelector {
	static networks = createSelector(
		(app: Record<string, any>) => app[NetworkModule.storeName],
		(state: INetworkState) => state.list,
	)

	static networkByName = (name: string) => createSelector(
		(state: Record<string, any>) => NetworkSelector.networks(state),
		(state: INetworkEnvironment[]) => (state || []).find(i => i.name === name),
	)

	static selectedNetwork = createSelector(
		(app: Record<string, any>) => app[NetworkModule.storeName],
		(state: INetworkState) => state.selected,
	)
}
