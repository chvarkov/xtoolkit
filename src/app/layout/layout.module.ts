import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { LogoComponent } from './components/logo/logo.component';
import { CoreModule } from '../core/core.module';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { StoreModule } from '@ngrx/store';
import { LAYOUT_FEATURE } from './constants';
import { layoutReducer } from './store/layout.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffect } from './store/layout.effect';

@NgModule({
	declarations: [
		LayoutComponent,
		LogoComponent,
		LoadingScreenComponent,
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(LAYOUT_FEATURE, layoutReducer),
		EffectsModule.forFeature([LayoutEffect]),
	],
	exports: [
		LayoutComponent,
		LogoComponent,
		StoreModule,
		EffectsModule,
		LoadingScreenComponent,
	],
})
export class LayoutModule { }
