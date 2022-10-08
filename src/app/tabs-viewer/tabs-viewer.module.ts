import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScViewerComponent } from './components/sc-viewer/sc-viewer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { ScViewerHeaderComponent } from './components/sc-viewer/sc-viewer-header/sc-viewer-header.component';
import { BoolInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/bool-input/bool-input.component';
import { ScInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/sc-input.component';
import { ScEndpointComponent } from './components/sc-viewer/sc-endpoint/sc-endpoint.component';
import { BytesInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/bytes-input/bytes-input.component';
import { BytesControlComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/controls/bytes-control/bytes-control.component';
import { NumberInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/number-input/number-input.component';
import { ScCodeComponent } from './components/sc-viewer/sc-code/sc-code.component';
import { ScTokensComponent } from './components/common/sc-tokens/sc-tokens.component';
import { ScNftsComponent } from './components/sc-viewer/sc-nfts/sc-nfts.component';
import { ScEndpointTxSignComponent } from './components/sc-viewer/sc-endpoint/sc-endpoint-tx-sign/sc-endpoint-tx-sign.component';
import { ScEndpointQueryComponent } from './components/sc-viewer/sc-endpoint/sc-endpoint-query/sc-endpoint-query.component';
import { TokenViewerComponent } from './components/token-viewer/token-viewer.component';
import { WalletViewerComponent } from './components/wallet-viewer/wallet-viewer.component';
import { AccountTransactionComponent } from './components/common/acccunt-transaction/account-transaction.component';
import { AcccountTransactionStatusBadgeComponent } from './components/common/acccunt-transaction/account-transaction-status-badge/account-transaction-status-badge.component';
import { TokenTransferComponent } from './components/token-viewer/token-transfer/token-transfer.component';
import { ScQueryResultComponent } from './components/sc-viewer/sc-endpoint/sc-query-result/sc-query-result.component';
import { ScQueryResultElementComponent } from './components/sc-viewer/sc-endpoint/sc-query-result/sc-query-result-element/sc-query-result-element.component';
import { ScTxResultComponent } from './components/sc-viewer/sc-endpoint/sc-tx-result/sc-tx-result.component';
import { EnumInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/enum-input/enum-input.component';
import { StructInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/struct-input/struct-input.component';
import { AddressBookViewerComponent } from './components/address-book-viewer/address-book-viewer.component';
import { NetworkModule } from '../network/network.module';
import { TxViewerComponent } from './components/tx-viewer/tx-viewer.component';
import { TxTokenOperationComponent } from './components/tx-viewer/tx-token-operation/tx-token-operation.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ArrayInputComponent } from './components/sc-viewer/sc-endpoint/sc-input/inputs/array-input/array-input.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';

@NgModule({
	declarations: [
		ScViewerComponent,
		BoolInputComponent,
		ScInputComponent,
		ScEndpointComponent,
		BytesInputComponent,
		BytesControlComponent,
		NumberInputComponent,
		ScViewerHeaderComponent,
		ScCodeComponent,
		ScTokensComponent,
		ScNftsComponent,
		ScEndpointTxSignComponent,
		ScEndpointQueryComponent,
		TokenViewerComponent,
		WalletViewerComponent,
		AccountTransactionComponent,
		AcccountTransactionStatusBadgeComponent,
		TokenTransferComponent,
		ScQueryResultComponent,
		ScQueryResultElementComponent,
		ScTxResultComponent,
		EnumInputComponent,
		StructInputComponent,
		AddressBookViewerComponent,
		TxViewerComponent,
		TxTokenOperationComponent,
		HomePageComponent,
		ArrayInputComponent,
		SettingsPageComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CoreModule,
		FormsModule,
		NetworkModule,
		DragDropModule,
	],
	exports: [
		ScViewerComponent,
		TokenViewerComponent,
		WalletViewerComponent,
		AddressBookViewerComponent,
		TxViewerComponent,
		HomePageComponent,
	]
})
export class TabsViewerModule { }
