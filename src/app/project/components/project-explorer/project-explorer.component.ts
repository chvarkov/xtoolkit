import { Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../../core/data-provider/data-provider';
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

@Component({
	selector: 'app-project-explorer',
	templateUrl: './project-explorer.component.html',
	styleUrls: ['./project-explorer.component.scss']
})
export class ProjectExplorerComponent implements OnInit, OnDestroy {
	projects$: Observable<Project[]>;
	projectExplorerState$: Observable<{ [id: string]: ProjectExplorerNode }>;

	activeElementRef?: ProjectElementComponent;

	private sub = new Subscription();

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	constructor(private readonly store: Store,
				private readonly actions$: Actions,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly ps: PersonalSettingsManager) {
		this.projects$ = this.store.select(ProjectSelector.projects);
		this.projectExplorerState$ = this.store.select(ProjectSelector.projectExplorerNodeMap);

		this.sub.add(
			this.projects$.pipe(
				filter(list => !!list.length),
			).subscribe((projects) => {
				if (projects) {
					this.ps.syncProjectExplorerTree(projects);
				}
			}),
		);

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
			isOpen: isExpanded,
			isShowActiveTab: false,
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
