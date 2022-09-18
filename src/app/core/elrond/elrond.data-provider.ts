import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { INetworkEnvironment } from './interfaces/network-environment';
import { ITokenPosition, ITokenPositionsFilter } from './interfaces/token-position';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
	AccountOnNetwork,
	ProxyNetworkProvider
} from '@elrondnetwork/erdjs-network-providers/out';
import { Address } from '@elrondnetwork/erdjs/out';
import { ITokenInfo } from './interfaces/token-info';
import { ITokenHolder } from './interfaces/token-holder';
import { IPaginationOptions } from './interfaces/pagination-options';
import { ITokenTransfer } from './interfaces/token-transfer';
import { ITokenRole } from './interfaces/token-role';

@Injectable({ providedIn: 'root' })
export class ElrondDataProvider {

	constructor(private readonly http: HttpClient) {
	}

	getProxy(network: INetworkEnvironment): ProxyNetworkProvider {
		return new ProxyNetworkProvider(network.gatewayUrl);
	}

	getAccountInfo(network: INetworkEnvironment, address: string): Observable<AccountOnNetwork> {
		return from(this.getProxy(network).getAccount(new Address(address)));
	}

	getTokenPositions(netwoek: INetworkEnvironment,
					  address: string,
					  filter?: ITokenPositionsFilter): Observable<ITokenPosition[]> {
		return this.http.get<ITokenPosition[]>(`${netwoek.gatewayUrl}/accounts/${address}/tokens`, {
			params: this.createParams(filter),
		});
	}

	getToken(network: INetworkEnvironment,
			 identifier: string): Observable<ITokenInfo> {
		return this.http.get<ITokenInfo>(`${network.gatewayUrl}/tokens/${identifier.trim()}`);
	}

	getTokenHolders(network: INetworkEnvironment,
					identifier: string,
					options: IPaginationOptions): Observable<ITokenHolder[]> {
		return this.http.get<ITokenHolder[]>(`${network.gatewayUrl}/tokens/${identifier.trim()}/accounts`, {
			params: this.createParams(options),
		});
	}

	getTokenTransfers(network: INetworkEnvironment,
					  identifier: string,
					  options: IPaginationOptions): Observable<ITokenTransfer[]> {
		return this.http.get<ITokenTransfer[]>(`${network.gatewayUrl}/tokens/${identifier.trim()}/transfers`, {
			params: this.createParams(options),
		});
	}

	getTokenRoles(network: INetworkEnvironment,
				  identifier: string): Observable<ITokenRole[]> {
		return this.http.get<ITokenRole[]>(`${network.gatewayUrl}/tokens/${identifier.trim()}/roles`);
	}

	private createParams(value?: Record<string, any>): HttpParams {
		const params = new HttpParams();

		if (value) {
			Object.keys(value).forEach(key => params.set(key, value[key]));
		}

		return params;
	}
}
