import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SecurityService } from './services/security.service';
import { PutPasswordComponent } from './components/put-password/put-password.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { securityReducer } from './store/security.reducer';
import { SECURITY_FEATURE } from './constants';
import { SecurityEffect } from './store/security.effect';

@NgModule({
	declarations: [
		PutPasswordComponent
	],
	imports: [
		CoreModule,
		StoreModule.forFeature(SECURITY_FEATURE, securityReducer),
		EffectsModule.forFeature([SecurityEffect]),
	],
	providers: [
		SecurityService,
		StoreModule,
		EffectsModule,
	],
})
export class SecurityModule { }
