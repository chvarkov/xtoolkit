import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

export interface SelectElement<T = any> {
	value: T;
	name: string;
}

export type SelectSize = 'small' | 'medium' | 'big';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent<T> implements OnInit {
	@ViewChild('selector', {static: true}) eRef?: ElementRef;

	isVisibleOptions = false;

	@Input() currentSelectedElement?: SelectElement<T>;

	@Input() nullable = false;

	@Input() size: SelectSize = 'big';

	@Input() placeHolder = 'Chose option';

	@Input() nullPlaceHolder = 'Nothing';

	@Input() elements: Array<SelectElement<T>> = [];

	@Output() selectedElement: EventEmitter<SelectElement<T>> = new EventEmitter<SelectElement<T>>();

	constructor() {

	}

	ngOnInit(): void {
		// this.selectedElement$.subscribe(v => console.log('next', v))
	}

	switchShowOptions(): void {
		this.isVisibleOptions = !this.isVisibleOptions;
	}

	selectElement(element?: SelectElement<T>): void {
		console.log('click elem')
		if (element || this.nullable) {
			this.selectedElement.emit(element);
			this.currentSelectedElement = element;
		}

		this.isVisibleOptions = false;
	}

	@HostListener('document:click', ['$event'])
	checkClick(event: any): void {
		console.log('ref', this.eRef?.nativeElement)
		if(this.eRef?.nativeElement.contains(event.target)) {
			console.log("clicked inside");
		} else {
			this.isVisibleOptions = false;
		}
	}
}
