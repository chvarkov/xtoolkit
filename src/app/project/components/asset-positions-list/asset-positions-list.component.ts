import { Component, Input, OnInit } from '@angular/core';
import { ITokenPosition } from '../../../core/elrond/interfaces/token-position';

@Component({
	selector: 'app-asset-positions-list',
	templateUrl: './asset-positions-list.component.html',
	styleUrls: ['./asset-positions-list.component.scss']
})
export class AssetPositionsListComponent implements OnInit {
	@Input() nativeAmount = '0';

	@Input() positions: ITokenPosition[] = [];

	@Input() canUsdFaucet = true;

	constructor() {
	}

	ngOnInit(): void {
	}

}
