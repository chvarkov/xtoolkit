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
import { ScTokensComponent } from './components/sc-viewer/sc-tokens/sc-tokens.component';
import { ScNftsComponent } from './components/sc-viewer/sc-nfts/sc-nfts.component';
import { ScEndpointTxSignComponent } from './components/sc-viewer/sc-endpoint/sc-endpoint-tx-sign/sc-endpoint-tx-sign.component';
import { ScEndpointQueryComponent } from './components/sc-viewer/sc-endpoint/sc-endpoint-query/sc-endpoint-query.component';

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
  ScEndpointQueryComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CoreModule,
		FormsModule
	],
	exports: [
		ScViewerComponent,
	]
})
export class ScViewerModule { }
