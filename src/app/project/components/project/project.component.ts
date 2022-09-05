import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../store/project.action';
import { ProjectSelector } from '../../store/project.selector';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
	projects$: Observable<Project[]>;

	selectedProject$: Observable<Project | undefined>;

	smartContracts$: Observable<ProjectScAbi[]>;

	constructor(private readonly store: Store) {
		this.projects$ = this.store.select(ProjectSelector.projects);
		this.selectedProject$ = this.store.select(ProjectSelector.selectedProject);
		this.smartContracts$ = this.store.select(ProjectSelector.smartContractsOfSelectedProject);
	}

	ngOnInit(): void {
		this.store.dispatch(ProjectAction.loadProjects());
	}

}
