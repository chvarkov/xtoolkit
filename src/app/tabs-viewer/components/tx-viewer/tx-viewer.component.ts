import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-tx-viewer',
	templateUrl: './tx-viewer.component.html',
	styleUrls: ['./tx-viewer.component.scss']
})
export class TxViewerComponent implements OnInit {
	@Input() txHash: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
