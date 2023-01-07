import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../store/project.action';

@Component({
	selector: 'app-active-project',
	templateUrl: './active-project.component.html',
	styleUrls: ['./active-project.component.scss']
})
export class ActiveProjectComponent implements OnInit {
	@Input() project!: Project;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	closeProject(): void {
		this.store.dispatch(ProjectAction.closeProject());
	}
}
