import { createAction, props } from '@ngrx/store';
import { NetworkInfo } from '../../core/data-provider/data-provider';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';

export class NetworkAction {
	static readonly loadNetworks = createAction(`[${NetworkAction.name}] load networks [...]`);
	static readonly loadNetworksSuccess = createAction(`[${NetworkAction.name}] load networks [OK]`, props<{data: NetworkInfo}>());
	static readonly loadNetworksError = createAction(`[${NetworkAction.name}] load networks [ERR]`, props<{err: Error}>());

	static readonly selectNetwork = createAction(`[${NetworkAction.name}] select network [...]`, props<{network: INetworkEnvironment}>());
	static readonly selectNetworkSuccess = createAction(`[${NetworkAction.name}] select network [OK]`, props<{network: INetworkEnvironment}>());
	static readonly selectNetworkError = createAction(`[${NetworkAction.name}] select network [ERR]`, props<{err: Error}>());
}

