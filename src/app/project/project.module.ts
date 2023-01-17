import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '@ngrx/store';
import { PROJECT_FEATURE } from './constants';
import { projectReducer } from './store/project.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProjectEffect } from './store/project.effect';
import { CreateProjectDialogComponent } from './components/dialogs/create-project-dialog/create-project-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerateWalletDialogComponent } from './components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { UploadAbiDialogComponent } from './components/dialogs/upload-abi-dialog/upload-abi-dialog.component';
import { ProjectExplorerComponent } from './components/project-explorer/project-explorer.component';
import { ProjectElementComponent } from './components/project-element/project-element.component';
import { NetworkModule } from '../network/network.module';
import { ExportMnemonicDialogComponent } from './components/dialogs/export-mnemonic-dialog/export-mnemonic-dialog.component';
import { IssueTokenDialogComponent } from './components/dialogs/esdt/issue-token-dialog/issue-token-dialog.component';
import { ImportTokenDialogComponent } from './components/dialogs/import-token-dialog/import-token-dialog.component';
import { IsActiveProjectElementPipe } from './pipes/is-active-project-element.pipe';
import { TokenIssueAwaiter } from './services/token-issue.awaiter';
import { UpdateProjectNetworkDialogComponent } from './components/dialogs/update-project-network-dialog/update-project-network-dialog.component';
import { AddSmartContractDialogComponent } from './components/dialogs/add-smart-contract-dialog/add-smart-contract-dialog.component';
import { AddProjectAddressDialogComponent } from './components/dialogs/add-project-address-dialog/add-project-address-dialog.component';
import { MintBurnTokenDialogComponent } from './components/dialogs/esdt/mint-burn-token-dialog/mint-burn-token-dialog.component';
import { PauseTokenDialogComponent } from './components/dialogs/esdt/pause-token-dialog/pause-token-dialog.component';
import { FreezeUnFreezeTokenDialogComponent } from './components/dialogs/esdt/freeze-un-freeze-token-dialog/freeze-un-freeze-token-dialog.component';
import { WipeTokenDialogComponent } from './components/dialogs/esdt/wipe-token-dialog/wipe-token-dialog.component';
import { SpecialRolesTokenDialogComponent } from './components/dialogs/esdt/special-roles-token-dialog/special-roles-token-dialog.component';
import { TransferOwnershipDialogComponent } from './components/dialogs/esdt/transfer-ownership-dialog/transfer-ownership-dialog.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MaiarWalletService } from './services/maiar-wallet.service';
import { ConnectMaiarWalletDialogComponent } from './components/dialogs/connect-maiar-wallet-dialog/connect-maiar-wallet-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SetMaiarWalletNameDialogComponent } from './components/dialogs/set-maiar-wallet-name-dialog/set-maiar-wallet-name-dialog.component';
import { ActiveProjectComponent } from './components/active-project/active-project.component';
import { ConnectedWalletComponent } from './components/connected-wallet/connected-wallet.component';
import { AddWasmDialogComponent } from './components/dialogs/add-wasm-dialog/add-wasm-dialog.component';

@NgModule({
	declarations: [
		CreateProjectDialogComponent,
		GenerateWalletDialogComponent,
		UploadAbiDialogComponent,
		ProjectExplorerComponent,
		ProjectElementComponent,
		ExportMnemonicDialogComponent,
		IssueTokenDialogComponent,
		ImportTokenDialogComponent,
		IsActiveProjectElementPipe,
		UpdateProjectNetworkDialogComponent,
		AddSmartContractDialogComponent,
		AddProjectAddressDialogComponent,
		MintBurnTokenDialogComponent,
		PauseTokenDialogComponent,
		FreezeUnFreezeTokenDialogComponent,
		WipeTokenDialogComponent,
		SpecialRolesTokenDialogComponent,
		TransferOwnershipDialogComponent,
		ProjectListComponent,
		ConnectMaiarWalletDialogComponent,
		SetMaiarWalletNameDialogComponent,
		ActiveProjectComponent,
		ConnectedWalletComponent,
  AddWasmDialogComponent,
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(PROJECT_FEATURE, projectReducer),
		EffectsModule.forFeature([ProjectEffect]),
		FormsModule,
		NetworkModule,
		ReactiveFormsModule,
		QRCodeModule,
	],
	providers: [
		TokenIssueAwaiter,
		MaiarWalletService,
	],
	exports: [
		StoreModule,
		EffectsModule,
		ProjectExplorerComponent,
		ActiveProjectComponent,
		ConnectedWalletComponent,
	],
})
export class ProjectModule { }
