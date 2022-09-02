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

@NgModule({
	declarations: [
		ProjectComponent,
		ProjectSelectorComponent,
		ScListComponent,
		ScElementComponent,
		WalletListComponent,
		WalletElementComponent,
		AssetPositionsListComponent
	],
	exports: [
		ProjectComponent,
		ProjectSelectorComponent,
		AssetPositionsListComponent
	],
	imports: [
		CommonModule,
		CoreModule
	]
})
export class ProjectModule { }
