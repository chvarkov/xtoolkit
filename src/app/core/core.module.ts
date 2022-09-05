import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { SelectComponent } from './ui/select/select.component';
import { TabsComponent } from './ui/tabs/tabs.component';
import { TabComponent } from './ui/tabs/tab/tab.component';
import { ToolbarIconButtonComponent } from './ui/toolbar/toolbar-icon-button/toolbar-icon-button.component';
import { ModalDialogComponent } from './ui/dialog/modal-dialog/modal-dialog.component';
import { ModalDialogFactory } from './ui/dialog/modal-dialog.factory';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { OptionComponent } from './ui/select/option/option.component';
import { DATA_PROVIDER } from './data-provider/data-provider';
import { LocalstorageDataProvider } from './data-provider/localstorage/localstorage.data-provider';
import { ElrondModule } from './elrond/elrond.module';
import { ShortStringPipe } from './pipes/short-string.pipe';

@NgModule({
	declarations: [
		ToolbarComponent,
		SelectComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ModalDialogComponent,
		ConfirmDialogComponent,
		OptionComponent,
		ShortStringPipe,
	],
	imports: [
		CommonModule,
		ElrondModule,
	],
	providers: [
		ModalDialogFactory,
		{
			provide: DATA_PROVIDER,
			useExisting: LocalstorageDataProvider,
		},
		LocalstorageDataProvider,
	],
	exports: [
		ElrondModule,
		ToolbarComponent,
		SelectComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ModalDialogComponent,
		OptionComponent,
		ShortStringPipe,
	],
})
export class CoreModule { }
