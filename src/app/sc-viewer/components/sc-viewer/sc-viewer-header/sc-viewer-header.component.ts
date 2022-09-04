import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-sc-viewer-header',
	templateUrl: './sc-viewer-header.component.html',
	styleUrls: ['./sc-viewer-header.component.scss']
})
export class ScViewerHeaderComponent implements OnInit {
	@Input() address: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
