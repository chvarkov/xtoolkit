import { NgModule } from '@angular/core';
import { ElrondDataProvider } from './elrond.data-provider';
import { HttpClientModule } from '@angular/common/http';
import { ScPipe } from './pipes/sc.pipe';

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		ElrondDataProvider,
	],
	declarations: [
		ScPipe,
	],
	exports: [
		ScPipe,
	],
})
export class ElrondModule {
}
