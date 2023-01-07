import { Component, Input, OnInit } from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar-icon-button',
  templateUrl: './toolbar-icon-button.component.html',
  styleUrls: ['./toolbar-icon-button.component.scss']
})
export class ToolbarIconButtonComponent implements OnInit {
	@Input() color = '';

	@Input() icon = '';

	@Input() hint = '';

	@Input() matMenuTriggerFor!: MatMenuPanel;

	constructor() {

	}

	ngOnInit(): void {
	}

}
