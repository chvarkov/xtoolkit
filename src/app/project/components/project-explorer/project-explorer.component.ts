import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
	ProjectWallet,
	Project,
	ProjectAbi,
	ProjectInfo,
	ProjectSmartContract
} from '../../../core/data-provider/data-provider';
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
import { FaucetService } from '../../../core/services/faucet.service';
import { MaiarWalletService } from '../../services/maiar-wallet.service';

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

	get maxResizeMovingX(): number {
		return window.innerWidth * 0.3;
	}

	constructor(private readonly store: Store,
				private readonly actions$: Actions,
				private readonly clipboard: Clipboard,
				public readonly faucet: FaucetService,
				private readonly maiarWalletService: MaiarWalletService,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly ps: PersonalSettingsManager) {
		this.projectsList$ = this.store.select(ProjectSelector.projectList);
		this.activeProject$ = this.store.select(ProjectSelector.activeProject());
		this.projectExplorerState$ = this.store.select(ProjectSelector.projectExplorerNodeMap);

		this.sub.add(
			this.actions$.pipe(
				ofType(ProjectAction.updateProjectExplorerTreeSuccess),
				filter(action => action.isShowActiveTab),
			).subscribe(() => {
				this.activeElementRef?.containerRef?.nativeElement?.scrollIntoView({behavior: 'smooth'});
			}),
		);

		this.sub.add(
			this.activeProject$.subscribe(async project => {
				if (project) {
					await this.ps.syncProjectExplorerTree(project).toPromise();

					this.store.dispatch(ProjectAction.loadProjectExplorerState({
						projectId: project.id,
					}));
				}
			}),
		);
	}

	ngOnInit(): void {
		this.loadProjects();
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	onActivateElement(element: ProjectElementComponent): void {
		this.activeElementRef = element;
	}

	showCurrentTab(projectId: string): void {
		this.store.dispatch(ProjectAction.showCurrentTabInExplorer({projectId}));
	}

	onExpandElement(projectId: string, type: ProjectComponentType, componentId: string, isExpanded: boolean): void {
		this.store.dispatch(ProjectAction.updateProjectExplorerTree({
			projectId,
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

	connectWalletViaMaiarApp(projectId: string): void {
		this.store.dispatch(ProjectAction.connectMaiarWallet({projectId}));
	}

	openProjectComponent(title: string,
						 componentType: ProjectComponentType,
						 componentId: string): void {
		this.store.dispatch(ProjectAction.openProjectTab({title, componentType, componentId}));
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

	closeProject(): void {
		this.store.dispatch(ProjectAction.closeProject());
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

	abiTrackBy(i: number, abi: ProjectAbi) {
		return abi.id;
	}

	scTrackBy(i: number, sc: ProjectSmartContract) {
		return sc.id;
	}

	tokenTrackBy(i: number, tokenId: string) {
		return tokenId;
	}

	walletTrackBy(i: number, wallet: ProjectWallet) {
		return wallet.address;
	}
}
