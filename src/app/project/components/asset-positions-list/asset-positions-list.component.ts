import { Component, Input, OnInit } from '@angular/core';
import { IAssetPosition } from '../../interfaces/asset-position';

@Component({
	selector: 'app-asset-positions-list',
	templateUrl: './asset-positions-list.component.html',
	styleUrls: ['./asset-positions-list.component.scss']
})
export class AssetPositionsListComponent implements OnInit {
	@Input() positions: IAssetPosition[] = [];

	@Input() canUsdFaucet = true;

	constructor() {
	}

	ngOnInit(): void {
	}

}
