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
import { IssueTokenDialogComponent } from './components/dialogs/issue-token-dialog/issue-token-dialog.component';
import { ImportTokenDialogComponent } from './components/dialogs/import-token-dialog/import-token-dialog.component';
import { IsActiveProjectElementPipe } from './pipes/is-active-project-element.pipe';

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
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(PROJECT_FEATURE, projectReducer),
		EffectsModule.forFeature([ProjectEffect]),
		FormsModule,
		NetworkModule,
		ReactiveFormsModule,
	],
	exports: [
		StoreModule,
		EffectsModule,
		ProjectExplorerComponent,
	],
})
export class ProjectModule { }
