import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkSelectorComponent } from './network-selector/network-selector.component';
import { CoreModule } from '../core/core.module';

@NgModule({
	declarations: [
		NetworkSelectorComponent
	],
	exports: [
		NetworkSelectorComponent
	],
	imports: [
		CommonModule,
		CoreModule
	]
})
export class NetworkModule { }
