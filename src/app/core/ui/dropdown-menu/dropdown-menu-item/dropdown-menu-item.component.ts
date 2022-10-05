import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-dropdown-menu-item',
	templateUrl: './dropdown-menu-item.component.html',
	styleUrls: ['./dropdown-menu-item.component.scss']
})
export class DropdownMenuItemComponent implements OnInit {
	@Input() color = '';
	@Input() icon = 'circle';
	@Input() text = '';

	constructor() {
	}

	ngOnInit(): void {
	}

}
