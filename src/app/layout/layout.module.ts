import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { LogoComponent } from './components/logo/logo.component';

@NgModule({
	declarations: [
		LayoutComponent,
  LogoComponent,
	],
	imports: [
		CommonModule
	],
	exports: [
		LayoutComponent,
		LogoComponent,
	],
})
export class LayoutModule { }
