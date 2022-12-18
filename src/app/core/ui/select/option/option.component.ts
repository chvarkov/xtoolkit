import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-option',
	templateUrl: './option.component.html',
	styleUrls: ['./option.component.scss']
})
export class OptionComponent {
	@Input() value?: any

	@ViewChild('option') content?: ElementRef;

	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	onClick(e: Event): void {
		e.stopPropagation();
		const name = this.content?.nativeElement?.innerText;

		if (name) {
			this.selected.emit({name, value: this.value});
		}
	}
}
