import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectSmartContract } from '../../../core/data-provider/data-provider';
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

	addSmartContract(projectId: string): void {
		this.store.dispatch(ProjectAction.addSmartContract({projectId}));
	}

	loadProjects(): void {
		this.store.dispatch(ProjectAction.loadProjects());
	}

	importToken(projectId: string): void {
		this.store.dispatch(ProjectAction.importToken({projectId}));
	}

	issueToken(projectId: string): void {
		this.store.dispatch(ProjectAction.issueToken({projectId}));
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

	openAddressBook(project: Project): void {
		this.openProjectComponent(project.id,`${project.name} address book`, 'address_book', project.id);
	}

	renameProject(projectId: string): void {
		this.store.dispatch(ProjectAction.renameProject({projectId}));
	}

	renameSmartContract(projectId: string, scId: string): void {
		this.store.dispatch(ProjectAction.renameSmartContract({projectId, scId}));
	}

	renameAbi(projectId: string, abiId: string): void {
		this.store.dispatch(ProjectAction.renameAbi({projectId, abiId}));
	}

	renameWallet(projectId: string, address: string): void {
		this.store.dispatch(ProjectAction.renameWallet({projectId, address}));
	}

	exploreToken(projectId: string, identifier: string): void {
		this.store.dispatch(ProjectAction.exploreToken({projectId, identifier}));
	}

	updateProjectNetwork(projectId: string): void {
		this.store.dispatch(ProjectAction.updateProjectNetwork({projectId}));
	}

	deleteProject(projectId: string): void {
		this.store.dispatch(ProjectAction.deleteProject({projectId}));
	}

	deleteSmartContract(projectId: string, scId: string): void {
		this.store.dispatch(ProjectAction.deleteSmartContract({projectId, scId}));
	}

	deleteAbi(projectId: string, abiId: string): void {
		this.store.dispatch(ProjectAction.deleteAbi({projectId, abiId}));
	}

	deleteToken(projectId: string, identifier: string): void {
		this.store.dispatch(ProjectAction.deleteToken({projectId, identifier}));
	}

	deleteWallet(projectId: string, address: string): void {
		this.store.dispatch(ProjectAction.deleteWallet({projectId, address}));
	}
}
