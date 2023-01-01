import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CorrectPasswordValidator } from '../../validators/correct-password.validator';
import { SECRET_MANAGER, SecretManager } from '../../../core/data-provider/secret.manager';

@Component({
	selector: 'app-put-password',
	templateUrl: './put-password.component.html',
	styleUrls: ['./put-password.component.scss']
})
export class PutPasswordComponent implements OnInit {
	readonly password = new FormControl('', [Validators.required], [
		CorrectPasswordValidator.createValidator(this.secretManager),
	]);

	constructor(readonly dialogRef: MatDialogRef<PutPasswordComponent>,
				@Inject(SECRET_MANAGER) readonly secretManager: SecretManager) {
	}

	ngOnInit(): void {
	}

	submit(): void {
		if (this.password.invalid) {
			return;
		}

		this.dialogRef.close(this.password.value);
	}
}
