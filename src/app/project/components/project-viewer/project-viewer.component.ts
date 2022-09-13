import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../store/project.selector';
import { ProjectAction } from '../../store/project.action';

@Component({
	selector: 'app-project-viewer',
	templateUrl: './project-viewer.component.html',
	styleUrls: ['./project-viewer.component.scss']
})
export class ProjectViewerComponent implements OnInit {
	projects$: Observable<Project[]>;

	selectedProject$: Observable<Project | undefined>;

	smartContracts$: Observable<ProjectScAbi[]>;

	constructor(private readonly store: Store) {
		this.projects$ = this.store.select(ProjectSelector.projects);
		this.selectedProject$ = this.store.select(ProjectSelector.selectedProject);
		this.smartContracts$ = this.store.select(ProjectSelector.smartContractsOfSelectedProject);
	}

	ngOnInit(): void {
		this.loadProjects();
	}

	createProject(): void {
		this.store.dispatch(ProjectAction.createProject());
	}

	uploadScAbi(): void {
		this.store.dispatch(ProjectAction.uploadAbi());
	}

	loadProjects(): void {
		this.store.dispatch(ProjectAction.loadProjects());
	}

	addToken(): void {
		this.store.dispatch(ProjectAction.addToken());
	}
}
