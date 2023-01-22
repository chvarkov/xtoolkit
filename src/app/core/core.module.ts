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
import { ESDTInteractor } from './elrond/services/esdt-intercator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenameDialogComponent } from './ui/rename-dialog/rename-dialog.component';
import { DecimalPlacesPipe } from './pipes/decimal-places.pipe';
import { FormFieldComponent } from './ui/form-field/form-field.component';
import { TokenIdentifierInputComponent } from './ui/token-identifier-input/token-identifier-input.component';
import { ResizeVerticalSplitterComponent } from './ui/resize-vertical-splitter/resize-vertical-splitter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppInitializer } from './services/app-initializer';
import { MaterialModule } from './ui/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalDialogHeaderComponent } from './ui/modal-dialog-header/modal-dialog-header.component';
import { TokenIdentifierSymbolPipe } from './pipes/token-identifier-symbol.pipe';
import { IsNotMainnetNetworkPipe } from './pipes/is-not-mainnet-network.pipe';
import { NftTypePipe } from './pipes/nft-type.pipe';
import { LocalstorageSecretManager } from './data-provider/localstorage/localstorage-secret.manager';
import { SECRET_MANAGER } from './data-provider/secret.manager';
import { TxSender } from './elrond/services/tx.sender';
import { ConfirmTransactionDialogComponent } from './ui/confirm-transaction-dialog/confirm-transaction-dialog.component';
import { SubStringPipe } from './pipes/sub-string.pipe';
import { ToastrModule } from 'ngx-toastr';
import { ToastrComponent } from './ui/toastr/toastr.component';
import { DecodeBase64Pipe } from './pipes/decode-base64.pipe';
import { BytesToKbPipe } from './pipes/bytes-to-kb.pipe';

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
		FormFieldComponent,
		TokenIdentifierInputComponent,
		TokenIdentifierInputComponent,
		ResizeVerticalSplitterComponent,
		ModalDialogHeaderComponent,
		TokenIdentifierSymbolPipe,
		IsNotMainnetNetworkPipe,
		NftTypePipe,
		ConfirmTransactionDialogComponent,
		SubStringPipe,
		ToastrComponent,
		DecodeBase64Pipe,
		BytesToKbPipe,
	],
	imports: [
		BrowserAnimationsModule,
		ElrondModule,
		FormsModule,
		ReactiveFormsModule,
		DragDropModule,
		MaterialModule,
		ToastrModule.forRoot({
			toastComponent: ToastrComponent,
			timeOut: 3_600,
			toastClass: '',
			positionClass: 'toast-bottom-right'
		}),
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
		{
			provide: SECRET_MANAGER,
			useExisting: LocalstorageSecretManager,
		},
		LocalstorageDataProvider,
		LocalstoragePersonalSettingManager,
		LocalstorageSecretManager,
		ESDTInteractor,
		TxSender,
		AppInitializer,
	],
	exports: [
		BrowserAnimationsModule,
		ElrondModule,
		MaterialModule,
		ReactiveFormsModule,
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
		FormFieldComponent,
		TokenIdentifierInputComponent,
		ResizeVerticalSplitterComponent,
		ModalDialogHeaderComponent,
		TokenIdentifierSymbolPipe,
		IsNotMainnetNetworkPipe,
		NftTypePipe,
		SubStringPipe,
		DecodeBase64Pipe,
		BytesToKbPipe,
	],
})
export class CoreModule { }
