import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-bytes-input',
	templateUrl: './bytes-input.component.html',
	styleUrls: ['./bytes-input.component.scss']
})
export class BytesInputComponent implements OnInit {
	@Output() changed: EventEmitter<Buffer> = new EventEmitter<Buffer>();

	constructor() {
	}

	ngOnInit(): void {
	}

}
