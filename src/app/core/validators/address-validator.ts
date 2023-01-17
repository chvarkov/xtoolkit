import { FormControl } from '@angular/forms';
import { Address } from '@multiversx/sdk-core/out';

export function addressValidator(control: FormControl): Record<'invalidAddress', boolean> | null {
	const value = control.value;

	return isValidAddress(value)
		? null
		: {invalidAddress: true};
}

export function isValidAddress(address: string): boolean {
	try {
		new Address(address);

		return true;
	} catch (e) {
		return false;
	}
}
