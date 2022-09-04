import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-sc-code',
	templateUrl: './sc-code.component.html',
	styleUrls: ['./sc-code.component.scss']
})
export class ScCodeComponent implements OnInit {
	@Input() code: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}


}
