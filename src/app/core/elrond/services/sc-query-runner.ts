import { Injectable } from '@angular/core';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { SmartContract } from '@elrondnetwork/erdjs/out';
import { ScArgsBuilder } from '../builders/sc-args.builder';

export interface IScQueryOptions {
	network: INetworkEnvironment,
	sc: SmartContract,
	functionName: string,
	caller?: Address,
	payload: Record<string, any>,
}

@Injectable({providedIn: 'root'})
export class ScQueryRunner {
	query(sc: SmartContract, options: IScQueryOptions): any {
		sc.createQuery({
			value: '0',
			caller: options.caller,
			func: sc.getEndpoint(options.functionName),
			args: new ScArgsBuilder(sc).build(options.functionName, options.payload),
		});
	}
}
