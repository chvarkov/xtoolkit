import { NgModule } from '@angular/core';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { TabsComponent } from './ui/tabs/tabs.component';
import { TabComponent } from './ui/tabs/tab/tab.component';
import { ToolbarIconButtonComponent } from './ui/toolbar/toolbar-icon-button/toolbar-icon-button.component';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { DATA_PROVIDER } from './data-provider/data-provider';
import { LocalstorageDataProvider } from './data-provider/localstorage/localstorage.data-provider';
import { ElrondModule } from './elrond/elrond.module';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { ComponentColorPipe } from './pipes/component-color.pipe';
import { ComponentIconPipe } from './pipes/component-icon.pipe';
import { LocalstoragePersonalSettingManager } from './data-provider/localstorage/localstorage-personal-setting.manager';
import { PERSONAL_SETTINGS_MANAGER } from './data-provider/personal-settings.manager';
import { AddressComponent } from './ui/address/address.component';
import { TxHashComponent } from './ui/tx-hash/tx-hash.component';
import { AddressInputComponent } from './ui/address-input/address-input.component';
import { ESDTInteractor } from './elrond/services/estd-intercator';
import { FormsModule } from '@angular/forms';
import { RenameDialogComponent } from './ui/rename-dialog/rename-dialog.component';
import { DecimalPlacesPipe } from './pipes/decimal-places.pipe';
import { TooltipComponent } from './ui/tooltip/tooltip.component';
import { TooltipDirective } from './ui/tooltip/tooltip.directive';
import { FormFieldComponent } from './ui/form-field/form-field.component';
import { TokenIdentifierInputComponent } from './ui/token-identifier-input/token-identifier-input.component';
import { ResizeVerticalSplitterComponent } from './ui/resize-vertical-splitter/resize-vertical-splitter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppInitializer } from './services/app-initializer';
import { MaterialModule } from './ui/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalDialogHeaderComponent } from './ui/modal-dialog-header/modal-dialog-header.component';

@NgModule({
	declarations: [
		ToolbarComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ConfirmDialogComponent,
		ShortStringPipe,
		ComponentColorPipe,
		ComponentIconPipe,
		AddressComponent,
		TxHashComponent,
		AddressInputComponent,
		RenameDialogComponent,
		DecimalPlacesPipe,
		TooltipComponent,
		TooltipDirective,
		FormFieldComponent,
		TokenIdentifierInputComponent,
		TokenIdentifierInputComponent,
		ResizeVerticalSplitterComponent,
		ModalDialogHeaderComponent,
	],
	imports: [
		BrowserAnimationsModule,
		ElrondModule,
		FormsModule,
		DragDropModule,
		MaterialModule,
	],
	providers: [
		{
			provide: DATA_PROVIDER,
			useExisting: LocalstorageDataProvider,
		},
		{
			provide: PERSONAL_SETTINGS_MANAGER,
			useExisting: LocalstoragePersonalSettingManager,
		},
		LocalstorageDataProvider,
		LocalstoragePersonalSettingManager,
		ESDTInteractor,
		AppInitializer,
	],
	exports: [
		ElrondModule,
		MaterialModule,
		ToolbarComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ShortStringPipe,
		ComponentIconPipe,
		ComponentColorPipe,
		AddressComponent,
		TxHashComponent,
		AddressInputComponent,
		DecimalPlacesPipe,
		TooltipDirective,
		FormFieldComponent,
		TokenIdentifierInputComponent,
		ResizeVerticalSplitterComponent,
		ModalDialogHeaderComponent,
	],
})
export class CoreModule { }
