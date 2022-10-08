import { createAction, props } from '@ngrx/store';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';

export class NetworkAction {
	static readonly loadNetworks = createAction(`[${NetworkAction.name}] load networks [...]`);
	static readonly loadNetworksSuccess = createAction(`[${NetworkAction.name}] load networks [OK]`, props<{list: INetworkEnvironment[]}>());
	static readonly loadNetworksError = createAction(`[${NetworkAction.name}] load networks [ERR]`, props<{err: Error}>());

	static readonly addNetwork = createAction(`[${NetworkAction.name}] add network [...]`);
	static readonly addNetworkSuccess = createAction(`[${NetworkAction.name}] add network [OK]`, props<{list: INetworkEnvironment[]}>());
	static readonly addNetworkError = createAction(`[${NetworkAction.name}] add network [ERR]`, props<{err: Error}>());

	static readonly updateNetwork = createAction(`[${NetworkAction.name}] update network [...]`, props<{chainId: string}>());
	static readonly updateNetworkSuccess = createAction(`[${NetworkAction.name}] update network [OK]`, props<{list: INetworkEnvironment[]}>());
	static readonly updateNetworksError = createAction(`[${NetworkAction.name}] update network [ERR]`, props<{err: Error}>());

	static readonly deleteNetwork = createAction(`[${NetworkAction.name}] delete network [...]`, props<{chainId: string}>());
	static readonly deleteNetworkSuccess = createAction(`[${NetworkAction.name}] delete network [OK]`, props<{list: INetworkEnvironment[]}>());
	static readonly deleteNetworksError = createAction(`[${NetworkAction.name}] delete network [ERR]`, props<{err: Error}>());
}
