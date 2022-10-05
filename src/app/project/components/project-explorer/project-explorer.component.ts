import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../store/project.selector';
import { ProjectAction } from '../../store/project.action';
import { ProjectComponentType } from '../../../core/types';
import {
	getProjectComponentNodeId,
	PERSONAL_SETTINGS_MANAGER,
	PersonalSettingsManager, ProjectExplorerNode, ProjectExplorerState
} from '../../../core/data-provider/personal-settings.manager';
import { filter, take } from 'rxjs/operators';

@Component({
	selector: 'app-project-explorer',
	templateUrl: './project-explorer.component.html',
	styleUrls: ['./project-explorer.component.scss']
})
export class ProjectExplorerComponent implements OnInit {
	projects$: Observable<Project[]>;
	projectExplorerState$: Observable<{ [id: string]: ProjectExplorerNode }>;

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	constructor(private readonly store: Store,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly ps: PersonalSettingsManager) {
		this.projects$ = this.store.select(ProjectSelector.projects);
		this.projectExplorerState$ = this.store.select(ProjectSelector.projectExplorerNodeMap);

		this.projects$.pipe(
			filter(list => !!list.length),
			take(1),
		).subscribe((projects) => {
			if (projects) {
				this.ps.syncProjectExplorerTree(projects).subscribe((s) => console.log('updated state', s));
			}
		})
	}

	ngOnInit(): void {
		this.loadProjects();
		this.store.dispatch(ProjectAction.loadProjectExplorerState());
	}

	showCurrentTab(): void {
		this.store.dispatch(ProjectAction.showCurrentTabInExplorer());
	}

	onExpandElement(projectId: string, type: ProjectComponentType, componentId: string, isExpanded: boolean): void {
		this.store.dispatch(ProjectAction.updateProjectExplorerTree({
			nodeId: getProjectComponentNodeId(projectId, type, componentId),
			withChildren: false,
			withParents: false,
			isOpen: isExpanded,
		}))
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
