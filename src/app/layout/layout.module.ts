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
import { HeaderIconButtonComponent } from './components/header-icon-button/header-icon-button.component';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { ThemeSwitcher } from './services/theme.switcher';
import { ThemeIconPipe } from './pipes/theme-icon.pipe';
import { DonationDialogComponent } from './components/donation-dialog/donation-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TabsWidgetComponent } from './components/tabs-widget/tabs-widget.component';
import { WidgetTabComponent } from './components/tabs-widget/widget-tab/widget-tab.component';

@NgModule({
	declarations: [
		LayoutComponent,
		LogoComponent,
		LoadingScreenComponent,
		HeaderIconButtonComponent,
		HeaderToolbarComponent,
		ThemeIconPipe,
		DonationDialogComponent,
		TabsWidgetComponent,
		WidgetTabComponent,
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(LAYOUT_FEATURE, layoutReducer),
		EffectsModule.forFeature([LayoutEffect]),
		QRCodeModule,
	],
	providers: [
		ThemeSwitcher,
	],
	exports: [
		LayoutComponent,
		LogoComponent,
		StoreModule,
		EffectsModule,
		LoadingScreenComponent,
		HeaderIconButtonComponent,
		HeaderToolbarComponent,
		ThemeIconPipe,
		TabsWidgetComponent,
		WidgetTabComponent,
	],
})
export class LayoutModule { }
