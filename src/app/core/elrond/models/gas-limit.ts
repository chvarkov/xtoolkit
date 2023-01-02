import { IGasLimit } from '@elrondnetwork/erdjs';

export class GasLimit implements IGasLimit {
	constructor(private readonly value: number) {
	}

	valueOf(): number {
		return this.value;
	}
}
