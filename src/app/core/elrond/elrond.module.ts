import { NgModule } from '@angular/core';
import { ElrondDataProvider } from './elrond.data-provider.service';
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
