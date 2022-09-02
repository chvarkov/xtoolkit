import {
	AfterContentInit,
	Component,
	ContentChildren,
	ElementRef,
	EventEmitter,
	HostListener,
	Input, OnDestroy,
	OnInit,
	Output, QueryList,
	ViewChild
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { Subscription } from 'rxjs';

export interface SelectElement<T = any> {
	value: T;
	name: string;
}

export type SelectSize = 'supersmall' | 'small' | 'medium' | 'big';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent<T> implements OnInit, AfterContentInit, OnDestroy {
	@ViewChild('selector', {static: true}) eRef?: ElementRef;
	@ContentChildren(OptionComponent) options?: QueryList<OptionComponent>;

	@Input() defaultElement?: SelectElement<T>;

	@Input() size: SelectSize = 'big';

	@Input() placeHolder = 'Chose option';

	@Output() selectedElement: EventEmitter<SelectElement<T>> = new EventEmitter<SelectElement<T>>();

	isVisibleOptions = false;

	sub = new Subscription();

	currentSelectedElement?: SelectElement<T>;

	ngOnInit(): void {
		if (this.defaultElement) {
			this.currentSelectedElement = this.defaultElement;
		}

		if (!this.options) {
			return;
		}

		this.options.forEach(option => {
			option.size = this.size;
		});
	}

	ngAfterContentInit(): void {
		if (!this.options) {
			return;
		}

		this.options.forEach(option => {
			this.sub.add(option.selected.subscribe((e) => this.selectElement(e)));
		});
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	switchShowOptions(): void {
		this.isVisibleOptions = !this.isVisibleOptions;
	}

	selectElement(element?: SelectElement<T>): void {
		if (element) {
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
