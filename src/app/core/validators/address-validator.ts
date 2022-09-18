import { FormControl } from '@angular/forms';
import { Address } from '@elrondnetwork/erdjs/out';

function addressValidator(control: FormControl): Record<'invalidAddress', boolean> | null {
	const value = control.value;

	try {
		new Address(value);

		return null;
	} catch (e) {
		return {
			invalidAddress: true,
		};
	}
}
