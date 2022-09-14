import { NgModule } from '@angular/core';
import { ElrondDataProvider } from './elrond.data-provider';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		ElrondDataProvider,
	],
})
export class ElrondModule {
}
