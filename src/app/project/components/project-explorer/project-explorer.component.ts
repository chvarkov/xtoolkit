import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../store/project.selector';
import { ProjectAction } from '../../store/project.action';
import { ProjectComponentType } from '../../../core/types';

@Component({
	selector: 'app-project-explorer',
	templateUrl: './project-explorer.component.html',
	styleUrls: ['./project-explorer.component.scss']
})
export class ProjectExplorerComponent implements OnInit {
	projects$: Observable<Project[]>;

	constructor(private readonly store: Store) {
		this.projects$ = this.store.select(ProjectSelector.projects);
	}

	ngOnInit(): void {
		this.loadProjects();
	}

	createProject(): void {
		this.store.dispatch(ProjectAction.createProject());
	}

	uploadScAbi(projectId: string): void {
		this.store.dispatch(ProjectAction.uploadAbi({projectId}));
	}

	loadProjects(): void {
		this.store.dispatch(ProjectAction.loadProjects());
	}

	addToken(projectId: string): void {
		this.store.dispatch(ProjectAction.addToken({projectId}));
	}

	generateWallet(projectId: string): void {
		this.store.dispatch(ProjectAction.generateWallet({projectId}));
	}

	openProjectComponent(projectId: string,
						 title: string,
						 componentType: ProjectComponentType,
						 componentId: string): void {
		this.store.dispatch(ProjectAction.openProjectTab({projectId, title, componentType, componentId}));
	}

	renameProject(projectId: string): void {
		this.store.dispatch(ProjectAction.renameProject({projectId}));
	}

	renameWallet(projectId: string, address: string): void {
		this.store.dispatch(ProjectAction.renameWallet({projectId, address}));
	}
}
