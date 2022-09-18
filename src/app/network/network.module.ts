import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '@ngrx/store';
import { networkReducer } from './store/network.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffect } from './store/network.effect';
import { NETWORK_FEATURE } from './constants';
import { NetworkNamePipe } from './pipes/network-name.pipe';

@NgModule({
	declarations: [
		NetworkNamePipe,
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(NETWORK_FEATURE, networkReducer),
		EffectsModule.forFeature([NetworkEffect]),
	],
	exports: [
		StoreModule,
		EffectsModule,
		NetworkNamePipe,
	],
})
export class NetworkModule {
	static storeName = 'networks';
}
