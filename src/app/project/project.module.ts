import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '@ngrx/store';
import { PROJECT_FEATURE } from './constants';
import { projectReducer } from './store/project.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProjectEffect } from './store/project.effect';
import { CreateProjectDialogComponent } from './components/create-project-dialog/create-project-dialog.component';
import { FormsModule } from '@angular/forms';
import { GenerateWalletDialogComponent } from './components/generate-wallet-dialog/generate-wallet-dialog.component';
import { UploadAbiDialogComponent } from './components/upload-abi-dialog/upload-abi-dialog.component';
import { ProjectExplorerComponent } from './components/project-explorer/project-explorer.component';
import { ProjectElementComponent } from './components/project-element/project-element.component';
import { AddTokenDialogComponent } from './components/add-token-dialog/add-token-dialog.component';

@NgModule({
	declarations: [
		CreateProjectDialogComponent,
		GenerateWalletDialogComponent,
		UploadAbiDialogComponent,
		ProjectExplorerComponent,
		ProjectElementComponent,
		AddTokenDialogComponent,
	],
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(PROJECT_FEATURE, projectReducer),
		EffectsModule.forFeature([ProjectEffect]),
		FormsModule,
	],
	exports: [
		StoreModule,
		EffectsModule,
		ProjectExplorerComponent,
	],
})
export class ProjectModule { }
