import { Injectable } from '@angular/core';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { Query, ResultsParser, SmartContract, TypedOutcomeBundle } from '@multiversx/sdk-core/out';
import { ScArgsBuilder } from '../builders/sc-args.builder';
import { ElrondProxyProvider } from './elrond-proxy-provider';

export interface IScQueryOptions {
	functionName: string,
	caller?: Address,
	payload: Record<string, any>,
}

@Injectable({providedIn: 'root'})
export class ScQueryRunner {
	private readonly resultParser = new ResultsParser();

	constructor(private readonly proxy: ElrondProxyProvider) {
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

	runQuery(network: INetworkEnvironment, sc: SmartContract, query: Query): Promise<TypedOutcomeBundle> {
		return this.proxy.getProxy(network).queryContract(query)
			.then(res => this.resultParser.parseQueryResponse(res, sc.getEndpoint(query.func.name)));
	}
}
