import { Component, Input, OnInit } from '@angular/core';
import { IAssetPosition } from '../../../../project/interfaces/asset-position';

@Component({
	selector: 'app-sc-tokens',
	templateUrl: './sc-tokens.component.html',
	styleUrls: ['./sc-tokens.component.scss']
})
export class ScTokensComponent implements OnInit {
	@Input() positions: IAssetPosition[] = [];

	constructor() {
	}

	ngOnInit(): void {
	}

}
