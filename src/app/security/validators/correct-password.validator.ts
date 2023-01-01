import { SecretManager } from '../../core/data-provider/secret.manager';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CorrectPasswordValidator {
	static createValidator(secretManager: SecretManager): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return secretManager.isValidPassword(control.value)
				.pipe(
					map((correct) => !correct ? { incorrectPassword: true } : null)
				);
		};
	}
}
