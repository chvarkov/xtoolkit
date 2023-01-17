import { IGasLimit } from '@multiversx/sdk-core';

export class GasLimit implements IGasLimit {
	constructor(private readonly value: number) {
	}

	valueOf(): number {
		return this.value;
	}
}
