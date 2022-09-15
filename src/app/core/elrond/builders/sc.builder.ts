import { AbiRegistry, Address, SmartContract, SmartContractAbi } from '@elrondnetwork/erdjs/out';

export type AbiJson = {
	name: string;
	endpoints: any[];
	types: any[];
};

export class ScBuilder {
	static build(address: string, abi: AbiJson): SmartContract {
		return new SmartContract({
			address: new Address(address),
			abi: new SmartContractAbi(AbiRegistry.create({ ...abi, endpoints: abi.endpoints.map(e => ({...e}))}))
		});
	}
}
