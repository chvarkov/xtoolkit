import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { ScViewerModule } from './sc-viewer/sc-viewer.module';
import { ProjectModule } from './project/project.module';
import { NetworkModule } from './network/network.module';
import { TransactionModule } from './transaction/transaction.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		TransactionModule,
		ScViewerModule,
		NetworkModule,
		LayoutModule,
		BrowserModule,
		AppRoutingModule,
		ProjectModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
