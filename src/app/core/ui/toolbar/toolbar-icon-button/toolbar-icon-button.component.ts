import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar-icon-button',
  templateUrl: './toolbar-icon-button.component.html',
  styleUrls: ['./toolbar-icon-button.component.scss']
})
export class ToolbarIconButtonComponent implements OnInit {
	@Input() hint = '';

	constructor() {

	}

	ngOnInit(): void {
	}

}
