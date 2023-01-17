import { Component, Input, OnInit } from '@angular/core';
import { v4 } from 'uuid';

@Component({
	selector: 'app-widget-tab',
	templateUrl: './widget-tab.component.html',
	styleUrls: ['./widget-tab.component.scss']
})
export class WidgetTabComponent implements OnInit {
	@Input() title: string = '';

	@Input() active: boolean = false;

	@Input() id: string = v4();

	constructor() {
	}

	ngOnInit(): void {
	}

}
