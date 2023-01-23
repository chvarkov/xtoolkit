import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
	name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
	transform(formControl: AbstractControl): string | undefined {
		const firstErrorCode = Object.keys(formControl.errors || {})[0];

		if (!firstErrorCode) {
			return undefined;
		}

		return this.transformErrorCode(firstErrorCode);
	}

	transformErrorCode(code: string): string {
		switch (code) {
			case 'required':
				return 'Required';
			case 'incorrectPassword':
				return 'Wrong password';
			case 'invalidAddress':
				return 'Invalid address';
			default:
				return 'Invalid value';
		}
	}
}
