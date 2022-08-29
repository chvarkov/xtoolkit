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

	@Input() defaultElement?: SelectElement<T>;

	@Input() nullable = false;

	@Input() size: SelectSize = 'big';

	@Input() placeHolder = 'Chose option';

	@Input() nullPlaceHolder = 'Nothing';

	@Input() elements: Array<SelectElement<T>> = [];

	@Output() selectedElement: EventEmitter<SelectElement<T>> = new EventEmitter<SelectElement<T>>();

	isVisibleOptions = false;

	currentSelectedElement?: SelectElement<T>;

	ngOnInit(): void {
		if (this.defaultElement) {
			this.currentSelectedElement = this.defaultElement;
		}
	}

	switchShowOptions(): void {
		this.isVisibleOptions = !this.isVisibleOptions;
	}

	selectElement(element?: SelectElement<T>): void {
		if (element || this.nullable) {
			this.selectedElement.emit(element);
			this.currentSelectedElement = element;
		}

		this.isVisibleOptions = false;
	}

	@HostListener('document:click', ['$event'])
	checkClick(event: Event): void {
		if (!this.eRef?.nativeElement.contains(event.target)) {
			this.isVisibleOptions = false;
		}
	}

	getCssClass(className: string): string {
		return `${className}-${this.size}`;
	}
}
