import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MatchPasswordsValidator {
	static validator: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
		if (!(group instanceof FormGroup)) {
			throw new Error();
		}

		const password = group.get('password')?.value;
		const confirmPassword = group.get('confirmPassword')?.value

		return password === confirmPassword ? null : { confirmPassword: true }
	}
}
