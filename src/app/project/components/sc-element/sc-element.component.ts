import { Component, OnInit } from '@angular/core';
import { IAssetPosition } from '../../interfaces/asset-position';

@Component({
	selector: 'app-sc-element',
	templateUrl: './sc-element.component.html',
	styleUrls: ['./sc-element.component.scss']
})
export class ScElementComponent implements OnInit {

	positions: IAssetPosition[] = [
		{ tokenId: 'WEGLD-354FA6', amount: '12.54'},
		{ tokenId: 'MEX-843DA3', amount: '0.3'},
	];

	constructor() {
	}

	ngOnInit(): void {
	}

}
