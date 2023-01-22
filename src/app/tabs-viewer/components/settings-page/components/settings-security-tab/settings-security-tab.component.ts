import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SecurityAction } from '../../../../../security/store/security.action';
import { Observable } from 'rxjs';
import { SecuritySelector } from '../../../../../security/store/security.selector';
import { map } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatchPasswordsValidator } from '../../validators/match-passwords.validator';
import { CorrectPasswordValidator } from '../../../../../security/validators/correct-password.validator';
import { SECRET_MANAGER, SecretManager } from '../../../../../core/data-provider/secret.manager';

@Component({
	selector: 'app-settings-security-tab',
	templateUrl: './settings-security-tab.component.html',
	styleUrls: ['./settings-security-tab.component.scss'],
})
export class SettingsSecurityTabComponent implements OnInit {
	isSecretsLocked$: Observable<boolean>;
	isPasswordSet$: Observable<boolean>;

	setPasswordForm: FormGroup;
	changePasswordForm: FormGroup;

	constructor(private readonly store: Store,
				@Inject(SECRET_MANAGER) private readonly secretManager: SecretManager,
				private readonly fb: FormBuilder) {
		this.isPasswordSet$ = this.store.select(SecuritySelector.isPasswordSet);
		this.isSecretsLocked$ = this.store.select(SecuritySelector.isSecretsUnlocked).pipe(map(v => !v));

		this.setPasswordForm = this.fb.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, {
			validators: MatchPasswordsValidator.validator,
		});

		this.changePasswordForm = this.fb.group({
			currentPassword: new FormControl('', [Validators.required], [
				CorrectPasswordValidator.createValidator(this.secretManager),
			]),
			password: ['', Validators.required],
			confirmPassword: ['', [Validators.required]],
		}, {
			validators: MatchPasswordsValidator.validator,
		});
	}

	ngOnInit(): void {
		this.store.dispatch(SecurityAction.loadSecurityState());
	}

	getChangePasswordControl(controlName: string): AbstractControl {
		return this.changePasswordForm.get(controlName)!;
	}

	getSetPasswordControl(controlName: string): AbstractControl {
		return this.setPasswordForm.get(controlName)!;
	}

	isShowChangePasswordError(controlName: string): boolean {
		const control = this.getChangePasswordControl(controlName);

		return control.invalid && (control.dirty || control.touched);
	}

	isShowSetPasswordError(controlName: string): boolean {
		const control = this.getSetPasswordControl(controlName);

		return control.invalid && (control.dirty || control.touched);
	}

	changePassword(): void {
		if (this.changePasswordForm.invalid) {
			return;
		}

		const value = this.changePasswordForm.value;

		this.store.dispatch(SecurityAction.setPassword({
			password: value.password,
			currentPassword: value.currentPassword,
		}));

		this.changePasswordForm.reset({});
	}

	setPassword(): void {
		if (this.setPasswordForm.invalid) {
			return;
		}

		const value = this.setPasswordForm.value;

		this.store.dispatch(SecurityAction.setPassword({
			password: value.password,
		}));

		this.setPasswordForm.reset({});
	}
}
