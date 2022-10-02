import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type SplitterSide = 'left' | 'right';

@Component({
	selector: 'app-resize-vertical-splitter',
	templateUrl: './resize-vertical-splitter.component.html',
	styleUrls: ['./resize-vertical-splitter.component.scss']
})
export class ResizeVerticalSplitterComponent implements OnInit {
	@Input() side: SplitterSide = 'left';

	@Output() dx: EventEmitter<number> = new EventEmitter<number>();

	isMoving = false;

	constructor() {
	}

	ngOnInit(): void {
	}

	onMouseMove(e: MouseEvent): void {
		if (this.isMoving) {
			this.dx.emit(e.movementX);
		}
	}

	onMouseDown(): void {
		this.isMoving = true;
	}

	onMouseUp(): void {
		this.isMoving = false;
	}

	onMouseOut(): void {
		this.isMoving = false;
	}
}
