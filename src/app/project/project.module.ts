import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { ProjectComponent } from './components/project/project.component';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';
import { ScListComponent } from './components/sc-list/sc-list.component';
import { ScElementComponent } from './components/sc-element/sc-element.component';
import { WalletListComponent } from './components/wallet-list/wallet-list.component';
import { WalletElementComponent } from './components/wallet-element/wallet-element.component';
import { AssetPositionsListComponent } from './components/asset-positions-list/asset-positions-list.component';
import { StoreModule } from '@ngrx/store';
import { PROJECT_FEATURE } from './constants';
import { projectReducer } from './store/project.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProjectEffect } from './store/project.effect';
import { CreateProjectDialogComponent } from './components/create-project-dialog/create-project-dialog.component';
import { FormsModule } from '@angular/forms';
import { GenerateWalletDialogComponent } from './components/generate-wallet-dialog/generate-wallet-dialog.component';
import { UploadAbiDialogComponent } from './components/upload-abi-dialog/upload-abi-dialog.component';
import { ProjectViewerComponent } from './components/project-viewer/project-viewer.component';
import { ProjectElementComponent } from './components/project-element/project-element.component';

@NgModule({
	declarations: [
		ProjectComponent,
		ProjectSelectorComponent,
		ScListComponent,
		ScElementComponent,
		WalletListComponent,
		WalletElementComponent,
		AssetPositionsListComponent,
		CreateProjectDialogComponent,
		GenerateWalletDialogComponent,
		UploadAbiDialogComponent,
  ProjectViewerComponent,
  ProjectElementComponent,
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
		ProjectComponent,
		ProjectSelectorComponent,
		AssetPositionsListComponent,
		ProjectViewerComponent,
	],
})
export class ProjectModule { }
