import {
	AfterViewInit,
	Component,
	ContentChildren,
	ElementRef,
	EventEmitter,
	HostListener,
	Input, OnChanges, OnDestroy,
	OnInit,
	Output, QueryList, SimpleChanges,
	ViewChild
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { Observable, Subscription } from 'rxjs';

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
export class SelectComponent<T = any> implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('selector', {static: true}) eRef?: ElementRef;
	@ContentChildren(OptionComponent) options?: QueryList<OptionComponent>;

	@Input() defaultElement?: SelectElement<T>;

	@Input() size: SelectSize = 'small';

	@Input() label = 'Chose option';

	@Input() icon = 'more_vert';

	@Output() selectionChange: EventEmitter<T> = new EventEmitter<T>();

	get selectedValue$(): Observable<T> {
		return this.selectionChange.asObservable();
	}

	isVisibleOptions = false;

	sub = new Subscription();
	optionsEventsSub = new Subscription();

	currentSelectedElement?: SelectElement<T>;

	ngOnInit(): void {
		if (this.defaultElement) {
			this.currentSelectedElement = this.defaultElement;
		}
	}

	ngAfterViewInit() {
		if (!this.options) {
			return;
		}

		if (this.options.length) {
			this.setupOptions(this.options.toArray());
		}

		this.sub.add(this.options.changes.subscribe((change: OptionComponent[]) => {
			this.setupOptions(change);
		}));
	}

	setupOptions(list: OptionComponent[]): void {
		this.optionsEventsSub.unsubscribe();
		this.optionsEventsSub = new Subscription();
		list.forEach(option => {
			this.optionsEventsSub.add(option.selected.subscribe((e) => {
				this.selectElement(e);
			}));
		});
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
		this.optionsEventsSub.unsubscribe();
	}

	switchShowOptions(e: Event): void {
		e.stopPropagation();
		this.isVisibleOptions = !this.isVisibleOptions;
	}

	selectElement(element?: SelectElement<T>): void {
		if (element) {
			this.selectionChange.emit(element.value);
			this.currentSelectedElement = element;
			this.defaultElement = element;
		}

		this.isVisibleOptions = false;
	}

	@HostListener('document:click', ['$event'])
	checkClick(event: Event): void {
		if (!this.eRef?.nativeElement.contains(event.target)) {
			this.isVisibleOptions = false;
		}
	}
}
