import { AbiRegistry, Address, SmartContract, SmartContractAbi } from '@elrondnetwork/erdjs/out';

export type AbiJson = {
	name: string;
	endpoints: any[];
	types: any[];
};

export class ScBuilder {
	static build(address: string, abi: AbiJson): SmartContract {
		let addressValue: Address | undefined;

		try {
			addressValue = new Address(address);
		} catch (e) {
		}

		return new SmartContract({
			address: addressValue,
			abi: new SmartContractAbi(AbiRegistry.create({ ...abi, endpoints: abi.endpoints.map(e => ({...e}))}))
		});
	}
}
