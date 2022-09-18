import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '@ngrx/store';
import { networkReducer } from './store/network.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffect } from './store/network.effect';
import { NETWORK_FEATURE } from './constants';
import { NetworkPipe } from './pipes/network.pipe';

@NgModule({
	declarations: [
		NetworkPipe,
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
		NetworkPipe,
	],
})
export class NetworkModule {
	static storeName = 'networks';
}
