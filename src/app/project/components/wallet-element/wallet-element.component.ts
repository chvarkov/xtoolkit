import { Component, OnInit } from '@angular/core';
import { IAssetPosition } from '../../interfaces/asset-position';

@Component({
	selector: 'app-wallet-element',
	templateUrl: './wallet-element.component.html',
	styleUrls: ['./wallet-element.component.scss']
})
export class WalletElementComponent implements OnInit {

	positions: IAssetPosition[] = [
		{ tokenId: 'WEGLD-354FA6', amount: '12.54'},
		{ tokenId: 'WEGLD-354FA6', amount: '0.3'},
		{ tokenId: 'WEGLD-354FA6', amount: '1436.64564'},
		{ tokenId: 'WEGLD-354FA6', amount: '0.000345346'},
		{ tokenId: 'WEGLD-354FA6', amount: '124536356.0435'},
		{ tokenId: 'WEGLD-354FA6', amount: '42.4'},
	];

	constructor() {
	}

	ngOnInit(): void {
	}

}
