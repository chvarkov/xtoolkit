import { AbiRegistry, Address, SmartContract, SmartContractAbi } from '@multiversx/sdk-core/out';

export type AbiJson = {
	name: string;
	endpoints: any[];
	types: any;
	buildInfo?: {
		framework?: {
			name?: string,
			version?: string,
		}
	}
};

export class ScBuilder {
	static build(address: string, abi: AbiJson): SmartContract {
		let addressValue: Address | undefined;

		try {
			addressValue = new Address(address);
		} catch (e) {
		}

		const restructured = {
			address: addressValue,
			abi: new SmartContractAbi(AbiRegistry.create({
				...abi,
				endpoints: abi.endpoints.map(e => ({...e})),
				types: Object.keys(abi.types)
					.map(key => ({[key]: {...abi.types[key as any]}}))
					.reduce((f, s) => ({...f, ...s}), {}) as any,
			}))
		};

		return new SmartContract(restructured);
	}
}
