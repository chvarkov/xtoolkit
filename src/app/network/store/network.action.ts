import { createAction, props } from '@ngrx/store';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';

export class NetworkAction {
	static readonly loadNetworks = createAction(`[${NetworkAction.name}] load networks [...]`);
	static readonly loadNetworksSuccess = createAction(`[${NetworkAction.name}] load networks [OK]`, props<{list: INetworkEnvironment[]}>());
	static readonly loadNetworksError = createAction(`[${NetworkAction.name}] load networks [ERR]`, props<{err: Error}>());
}

