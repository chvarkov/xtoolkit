import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTabsComponent } from './components/project-tabs/project-tabs.component';
import { ProjectTabComponent } from './components/project-tab/project-tab.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CoreModule } from '../../../core/core.module';

@NgModule({
	declarations: [
		ProjectTabsComponent,
		ProjectTabComponent,
	],
	exports: [
		ProjectTabsComponent,
		ProjectTabComponent
	],
	imports: [
		CommonModule,
		DragDropModule,
		CoreModule,
	]
})
export class ProjectTabsModule { }
