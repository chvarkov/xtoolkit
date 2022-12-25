import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project, ProjectInfo } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../store/project.selector';
import { ProjectAction } from '../../store/project.action';
import { ProjectComponentType } from '../../../core/types';
import {
	getProjectComponentNodeId,
	PERSONAL_SETTINGS_MANAGER,
	PersonalSettingsManager,
	ProjectExplorerNode,
} from '../../../core/data-provider/personal-settings.manager';
import { filter } from 'rxjs/operators';
import { ProjectElementComponent } from '../project-element/project-element.component';
import { Actions, ofType } from '@ngrx/effects';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
	selector: 'app-project-explorer',
	templateUrl: './project-explorer.component.html',
	styleUrls: ['./project-explorer.component.scss']
})
export class ProjectExplorerComponent implements OnInit, OnDestroy {
	projectsList$: Observable<ProjectInfo[]>;
	activeProject$: Observable<Project | undefined>;
	projectExplorerState$: Observable<{ [id: string]: ProjectExplorerNode }>;

	activeElementRef?: ProjectElementComponent;

	private sub = new Subscription();

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	constructor(private readonly store: Store,
				private readonly actions$: Actions,
				private readonly clipboard: Clipboard,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly ps: PersonalSettingsManager) {
		this.projectsList$ = this.store.select(ProjectSelector.projectList);
		this.activeProject$ = this.store.select(ProjectSelector.activeProject());
		this.projectExplorerState$ = this.store.select(ProjectSelector.projectExplorerNodeMap);

		// this.sub.add( // TODO: Refactor it
		// 	this.projects$.pipe(
		// 		filter(list => !!list.length),
		// 	).subscribe(async (projects) => {
		// 		if (projects) {
		// 			await this.ps.syncProjectExplorerTree(projects).toPromise();
		// 		}
		// 	}),
		// );

		this.sub.add(
			this.actions$.pipe(
				ofType(ProjectAction.updateProjectExplorerTreeSuccess),
				filter(action => action.isShowActiveTab),
			).subscribe(() => {
				this.activeElementRef?.containerRef?.nativeElement?.scrollIntoView({behavior: 'smooth'});
			}),
		);
	}

	ngOnInit(): void {
		this.loadProjects();
		this.store.dispatch(ProjectAction.loadProjectExplorerState());
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	onActivateElement(element: ProjectElementComponent): void {
		this.activeElementRef = element;
	}

	showCurrentTab(): void {
		this.store.dispatch(ProjectAction.showCurrentTabInExplorer());
	}

	onExpandElement(projectId: string, type: ProjectComponentType, componentId: string, isExpanded: boolean): void {
		this.store.dispatch(ProjectAction.updateProjectExplorerTree({
			nodeId: getProjectComponentNodeId(projectId, type, componentId),
			withChildren: false,
			withParents: false,
			isExpanded: isExpanded,
			isShowActiveTab: false,
		}))
	}

	openProject(id: string): void {
		this.store.dispatch(ProjectAction.openProject({id}));
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
		this.store.dispatch(ProjectAction.loadProjectList());
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

	openProjectComponent(title: string,
						 componentType: ProjectComponentType,
						 componentId: string): void {
		this.store.dispatch(ProjectAction.openProjectTab({title, componentType, componentId}));
	}

	openAddressBook(project: Project): void {
		this.openProjectComponent(`${project.name} address book`, 'address_book', project.id);
	}

	renameProject(projectId: string, name: string): void {
		this.store.dispatch(ProjectAction.renameProject({projectId, name}));
	}

	renameSmartContract(projectId: string, scId: string, name: string): void {
		this.store.dispatch(ProjectAction.renameSmartContract({projectId, scId, name}));
	}

	renameAbi(projectId: string, abiId: string, name: string): void {
		this.store.dispatch(ProjectAction.renameAbi({projectId, abiId, name}));
	}

	renameWallet(projectId: string, address: string, name: string): void {
		this.store.dispatch(ProjectAction.renameWallet({projectId, address, name}));
	}

	copyWalletAddress(address: string): void {
		this.clipboard.copy(address);
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
