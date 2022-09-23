import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { TabsComponent } from './ui/tabs/tabs.component';
import { TabComponent } from './ui/tabs/tab/tab.component';
import { ToolbarIconButtonComponent } from './ui/toolbar/toolbar-icon-button/toolbar-icon-button.component';
import { ModalDialogComponent } from './ui/dialog/modal-dialog/modal-dialog.component';
import { ModalDialogFactory } from './ui/dialog/modal-dialog.factory';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
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

@NgModule({
	declarations: [
		ToolbarComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ModalDialogComponent,
		ConfirmDialogComponent,
		ShortStringPipe,
		DropdownMenuComponent,
		DropdownMenuItemComponent,
		ComponentColorPipe,
		ComponentIconPipe,
  AddressComponent,
  TxHashComponent,
  AddressInputComponent,
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
		{
			provide: PERSONAL_SETTINGS_MANAGER,
			useExisting: LocalstoragePersonalSettingManager,
		},
		LocalstorageDataProvider,
		LocalstoragePersonalSettingManager,
		ESDTInteractor,
	],
    exports: [
        ElrondModule,
        ToolbarComponent,
        TabsComponent,
        TabComponent,
        ToolbarIconButtonComponent,
        ModalDialogComponent,
        ShortStringPipe,
        DropdownMenuComponent,
        DropdownMenuItemComponent,
        ComponentIconPipe,
        ComponentColorPipe,
        AddressComponent,
        TxHashComponent,
        AddressInputComponent,
    ],
})
export class CoreModule { }
