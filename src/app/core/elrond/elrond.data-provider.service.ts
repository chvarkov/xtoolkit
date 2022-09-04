import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { ITokenPosition, ITokenPositionsFilter } from './interfaces/token-position';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ElrondDataProvider {

	constructor(private readonly http: HttpClient) {
	}

	getTokenPositions(netwoek: INetworkEnvironment,
					  address: string,
					  filter?: ITokenPositionsFilter): Observable<ITokenPosition[]> {
		return this.http.get<ITokenPosition[]>(`${netwoek.gatewayUrl}/accounts/${address}/tokens`, {
			params: this.createParams(filter),
		});
	}

	private createParams(value?: Record<string, any>): HttpParams {
		const params = new HttpParams();

		if (value) {
			Object.keys(value).forEach(key => params.set(key, value[key]));
		}

		return params;
	}
}
