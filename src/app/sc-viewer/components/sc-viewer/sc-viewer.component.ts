import { Component, Input, OnInit } from '@angular/core';
import { IScAbi } from '../../../core/interfaces/sc-abi';
import { INetworkEnvironment } from '../../../core/interfaces/network-environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IAssetPosition } from '../../../project/interfaces/asset-position';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit {
	@Input() address: string = '';

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() positions: IAssetPosition[] = [
		{ tokenId: 'WEGLD-354FA6', amount: '12.54'},
		{ tokenId: 'MEX-843DA3', amount: '0.3'},
	];

	@Input() abi: IScAbi = {
		name: '',
		constructor: {
			inputs: [],
			outputs: [],
		},
		endpoints: [],
		types: {},
	};

	@Input() code: string = '';

	ngOnInit(): void {
	}
}
