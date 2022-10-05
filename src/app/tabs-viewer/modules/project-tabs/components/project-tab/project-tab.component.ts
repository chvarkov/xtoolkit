import { Component, Input, OnInit } from '@angular/core';
import { ProjectComponentType } from '../../../../../core/types';

@Component({
	selector: 'app-project-tab',
	templateUrl: './project-tab.component.html',
	styleUrls: ['./project-tab.component.scss']
})
export class ProjectTabComponent implements OnInit {
	@Input() index: number = 0;

	@Input() title: string = '';

	@Input() type: ProjectComponentType = 'group';

	@Input() active = false;

	constructor() {
	}

	ngOnInit(): void {
	}
}
