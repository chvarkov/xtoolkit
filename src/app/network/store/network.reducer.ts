import { Action, createReducer, on } from '@ngrx/store';
import { NetworkAction } from './network.action';
import { NetworkInfo } from '../../core/data-provider/data-provider';
import { DEFAULT_NETWORKS } from '../../core/constants';

export interface INetworkState extends NetworkInfo {
}

const initialState: INetworkState = {
	list: [],
	selected: DEFAULT_NETWORKS[0],
};

export const reducer = createReducer(
	initialState,
	on(NetworkAction.loadNetworksSuccess, (state, { data }) => {
		return {
			...state,
			list: data.list,
			selected: data.selected,
		}
	}),
	on(NetworkAction.selectNetworkSuccess, (state, { network }) => ({
		...state,
		selected: network,
	})),
);


export function networkReducer(state: INetworkState | undefined, action: Action): INetworkState {
	return reducer(state, action);
}
