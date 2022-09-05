import { Component, Input, OnInit } from '@angular/core';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-sc-list',
	templateUrl: './sc-list.component.html',
	styleUrls: ['./sc-list.component.scss']
})
export class ScListComponent implements OnInit {
	@Input() list: ProjectScAbi[] = [];

	constructor() {
	}

	ngOnInit(): void {
	}

}
