import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { SelectComponent } from './ui/select/select.component';
import { TabsComponent } from './ui/tabs/tabs.component';
import { TabComponent } from './ui/tabs/tab/tab.component';
import { ToolbarIconButtonComponent } from './ui/toolbar/toolbar-icon-button/toolbar-icon-button.component';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { OptionComponent } from './ui/select/option/option.component';
import { DATA_PROVIDER } from './data-provider/data-provider';
import { LocalstorageDataProvider } from './data-provider/localstorage/localstorage.data-provider';
import { ElrondModule } from './elrond/elrond.module';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { DropdownMenuComponent } from './ui/dropdown-menu/dropdown-menu.component';
import { DropdownMenuItemComponent } from './ui/dropdown-menu/dropdown-menu-item/dropdown-menu-item.component';
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
import { ModalDialogComponent } from './ui/modal-dialog/modal-dialog.component';

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
		DropdownMenuComponent,
		DropdownMenuItemComponent,
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
	],
	imports: [
		CommonModule,
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
		SelectComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ModalDialogComponent,
		OptionComponent,
		ShortStringPipe,
		DropdownMenuComponent,
		DropdownMenuItemComponent,
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
	],
})
export class CoreModule { }
