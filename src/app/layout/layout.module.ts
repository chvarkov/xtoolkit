import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { LogoComponent } from './components/logo/logo.component';
import { CoreModule } from '../core/core.module';

@NgModule({
	declarations: [
		LayoutComponent,
  LogoComponent,
	],
    imports: [
        CommonModule,
        CoreModule
    ],
	exports: [
		LayoutComponent,
		LogoComponent,
	],
})
export class LayoutModule { }
