import { Action, createReducer, on } from '@ngrx/store';
import { NetworkAction } from './network.action';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';

export interface INetworkState {
	list: INetworkEnvironment[];
}

const initialState: INetworkState = {
	list: [],
};

export const reducer = createReducer(
	initialState,
	on(NetworkAction.loadNetworksSuccess, (state, { list }) => {
		return {
			...state,
			list,
		};
	}),
	on(NetworkAction.addNetworkSuccess, (state, { list }) => {
		return {
			...state,
			list,
		};
	}),
	on(NetworkAction.updateNetworkSuccess, (state, { list }) => {
		return {
			...state,
			list,
		};
	}),
	on(NetworkAction.deleteNetworkSuccess, (state, { list }) => {
		return {
			...state,
			list,
		};
	}),
);


export function networkReducer(state: INetworkState | undefined, action: Action): INetworkState {
	return reducer(state, action);
}
