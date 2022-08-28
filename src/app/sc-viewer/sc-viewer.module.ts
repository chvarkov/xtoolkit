import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScViewerComponent } from './components/sc-viewer/sc-viewer.component';

@NgModule({
	declarations: [
		ScViewerComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		ScViewerComponent
	]
})
export class ScViewerModule { }
