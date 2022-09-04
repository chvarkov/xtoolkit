import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { INetworkEnvironment } from '../../core/interfaces/network-environment';
import { Observable } from 'rxjs';
import { IElrondTransaction } from '../interfaces/elrond-transaction';

@Injectable({providedIn: 'root'})
export class TransactionProvider {
	constructor(private readonly http: HttpClient) {
	}

	getTransactions(network: INetworkEnvironment, address: string): Observable<IElrondTransaction[]> {
		return this.http.get<IElrondTransaction[]>(`${network.gatewayUrl}/accounts/${address}/transactions`, {
			params: {
				withScamInfo: true,
			},
		});
	}
}
