import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { INetworkEnvironment } from './interfaces/network-environment';
import { ITokenPosition, ITokenPositionsFilter } from './interfaces/token-position';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
	AccountOnNetwork,
	ProxyNetworkProvider
} from '@elrondnetwork/erdjs-network-providers/out';
import { Address, Transaction } from '@elrondnetwork/erdjs/out';
import { ITokenInfo } from './interfaces/token-info';
import { ITokenHolder } from './interfaces/token-holder';
import { IPaginationOptions } from './interfaces/pagination-options';
import { ITokenTransfer } from './interfaces/token-transfer';
import { ITokenRole } from './interfaces/token-role';
import { catchError, map } from 'rxjs/operators';
import { IEstimateTxData } from './interfaces/estimate-tx-data';
import { ITokenSearchOptions } from './interfaces/token-search-options';

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

	getTokenPositions(network: INetworkEnvironment,
					  address: string,
					  filter?: ITokenPositionsFilter): Observable<ITokenPosition[]> {
		return this.http.get<ITokenPosition[]>(`${network.gatewayUrl}/accounts/${address}/tokens`, {
			params: this.createParams(filter),
		});
	}

	estimateTransactionConst(network: INetworkEnvironment,
							 tx: Transaction): Observable<number> {
		const data: IEstimateTxData = {
			data: tx.getData().encoded(),
			sender: tx.getSender().bech32(),
			nonce: tx.getNonce().valueOf(),
			value: tx.getValue().toString(),
			receiver: tx.getReceiver().bech32(),
			chainID: tx.getChainID().valueOf(),
			version: 1,
		};
		return this.http.post<any>(`${network.gatewayUrl}/transaction/cost`, data).pipe(
			map((res: {code: string, data: {txGasUnits: number}}) => res.data.txGasUnits)
		);
	}

	getToken(network: INetworkEnvironment,
			 identifier: string): Observable<ITokenInfo> {
		return this.http.get<ITokenInfo>(`${network.gatewayUrl}/tokens/${identifier.trim()}`);
	}

	getTokens(network: INetworkEnvironment,
			  options?: ITokenSearchOptions): Observable<ITokenInfo[]> {
		return this.http.get<ITokenInfo[]>(`${network.gatewayUrl}/tokens`, {
			params: this.createParams(options),
		});
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
		return this.http.get<ITokenRole[]>(`${network.gatewayUrl}/tokens/${identifier.trim()}/roles`).pipe(
			catchError((err) => of([])),
		);
	}

	private createParams(value?: Record<string, any>): HttpParams {
		const params = new HttpParams();

		if (value) {
			Object.keys(value).forEach(key => params.set(key, value[key]));
		}

		return params;
	}
}
