import { createSelector } from '@ngrx/store';
import { INetworkState } from './network.reducer';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';
import { NETWORK_FEATURE } from '../constants';

export class NetworkSelector {
	static networks = createSelector(
		(app: Record<string, any>) => app[NETWORK_FEATURE],
		(state: INetworkState) => state.list,
	)

	static networkByName = (name: string) => createSelector(
		(state: Record<string, any>) => NetworkSelector.networks(state),
		(state: INetworkEnvironment[]) => (state || []).find(i => i.name === name),
	)

	static selectedNetwork = createSelector(
		(app: Record<string, any>) => app[NETWORK_FEATURE],
		(state: INetworkState) => state.selected,
	)
}
