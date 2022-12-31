import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectInfo } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-project-list',
	templateUrl: './project-list.component.html',
	styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
	@Input() projects: ProjectInfo[] = [];

	@Output() open: EventEmitter<string> = new EventEmitter<string>();

	@Output() create: EventEmitter<void> = new EventEmitter<void>();

	constructor() {
	}

	ngOnInit(): void {
	}

}
