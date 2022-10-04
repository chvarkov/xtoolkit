import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

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

	onMouseDown(): void {
		this.isMoving = true;
	}

	@HostListener('document:mousemove', ['$event'])
	onMouseMove(e: MouseEvent): void {
		if (this.isMoving) {
			this.dx.emit(e.movementX);
		}
	}

	@HostListener('document:mouseup', ['$event'])
	onMouseUp(): void {
		this.isMoving = false;
	}
}
