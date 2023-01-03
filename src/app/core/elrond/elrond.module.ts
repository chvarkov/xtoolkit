import { NgModule } from '@angular/core';
import { ElrondDataProvider } from './elrond.data-provider';
import { HttpClientModule } from '@angular/common/http';
import { ScPipe } from './pipes/sc.pipe';
import { ElrondProxyProvider } from './services/elrond-proxy-provider';
import { ScQueryRunner } from './services/sc-query-runner';
import { ScInteractor } from './services/sc-interactor';
import { WalletConnector } from './services/wallet-connector';

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		ElrondDataProvider,
		ElrondProxyProvider,
		ScQueryRunner,
		ScInteractor,
		WalletConnector,
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
