import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'app-dropdown-menu',
	templateUrl: './dropdown-menu.component.html',
	styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {
	@ViewChild('dropdown', {static: true}) selfRef?: ElementRef;

	isOpen = false;

	@Input() menuPosition:'left' | 'right' = 'right';

	constructor() {
	}

	ngOnInit(): void {
	}

	@HostListener('document:click', ['$event'])
	checkClick(event: Event): void {
		if (!this.selfRef?.nativeElement.contains(event.target)) {
			this.isOpen = false;
		}
	}
}
