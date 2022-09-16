import { Injectable } from '@angular/core';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { Query, SmartContract } from '@elrondnetwork/erdjs/out';
import { ScArgsBuilder } from '../builders/sc-args.builder';
import { ContractQueryResponse, ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';

export interface IScQueryOptions {
	functionName: string,
	caller?: Address,
	payload: Record<string, any>,
}

@Injectable({providedIn: 'root'})
export class ScQueryRunner {
	getProxy(network: INetworkEnvironment): ProxyNetworkProvider {
		return new ProxyNetworkProvider(network.gatewayUrl);
	}

	createQuery(sc: SmartContract, options: IScQueryOptions): Query {
		return sc.createQuery({
			value: '0',
			caller: options.caller,
			func: {
				name: options.functionName,
				toString(): string {
					return options.functionName;
				}
			},
			args: new ScArgsBuilder(sc).build(options.functionName, options.payload),
		});
	}

	runQuery(network: INetworkEnvironment, query: Query): Promise<ContractQueryResponse> {
		return this.getProxy(network).queryContract(query);
	}
}
