import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-widget',
	templateUrl: './widget.component.html',
	styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit {
	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	get minResizeMovingX(): number {
		return window.innerWidth - 480;
	}

	get maxResizeMoving(): number {
		return window.innerWidth - 360;
	}

	constructor() {
	}

	ngOnInit(): void {
	}
}
