import { Component, Input, OnInit } from '@angular/core';
import { IScAbi } from '../../../core/interfaces/sc-abi';
import { INetworkEnvironment } from '../../../core/interfaces/network-environment';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss']
})
export class ScViewerComponent implements OnInit {
	@Input() address: string = '';

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() abi: IScAbi = {
		name: '',
		constructor: {
			inputs: [],
			outputs: [],
		},
		endpoints: [],
		types: {},
	};


	constructor() {
	}

	ngOnInit(): void {
	}

}
