import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-token-viewer',
	templateUrl: './token-viewer.component.html',
	styleUrls: ['./token-viewer.component.scss']
})
export class TokenViewerComponent implements OnInit {

	@Input() tokenId: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
