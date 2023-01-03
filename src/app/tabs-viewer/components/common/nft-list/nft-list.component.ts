import { Component, Input, OnInit } from '@angular/core';
import { INft } from '../../../../core/elrond/interfaces/nft';

@Component({
	selector: 'app-nft-list',
	templateUrl: './nft-list.component.html',
	styleUrls: ['./nft-list.component.scss']
})
export class NftListComponent implements OnInit {
	@Input() list: INft[] = [];

	constructor() {
	}

	ngOnInit(): void {
	}

}
