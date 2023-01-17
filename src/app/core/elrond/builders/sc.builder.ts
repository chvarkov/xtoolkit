import { AbiRegistry, Address, SmartContract, SmartContractAbi } from '@multiversx/sdk-core/out';

export type AbiJson = {
	name: string;
	endpoints: any[];
	types: { [name: string]: Record<string, any> };
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

		const types = Object.entries(abi.types) // TODO: Upgrade mx core-sdk to v12 and remove it.
			.sort(([key, value]) => value.type !== 'enum' ? 1 : -1)
			.map(([key, value]) => ({[key]: { ...value }}))
			.reduce((p, c) => ({...p, ...c}), {});

		const restructured = {
			address: addressValue,
			abi: new SmartContractAbi(AbiRegistry.create({
				...abi,
				endpoints: abi.endpoints.map(e => ({...e})),
				types,
			}))
		};

		return new SmartContract(restructured);
	}
}
