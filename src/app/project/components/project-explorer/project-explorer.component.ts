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
	DEFAULT_PROJECT_EXPLORER_STATE,
	getUpdateExplorerStatePayload,
	PERSONAL_SETTINGS_MANAGER,
	PersonalSettingsManager,
	ProjectExplorerExpandState,
} from '../../../core/data-provider/personal-settings.manager';
import { filter } from 'rxjs/operators';
import { ProjectElementComponent } from '../project-element/project-element.component';
import { Actions, ofType } from '@ngrx/effects';
import { FaucetService } from '../../../core/services/faucet.service';
import { MaiarWalletService } from '../../services/maiar-wallet.service';
import { ClipboardService } from '../../../core/services/clipboard.service';

@Component({
	selector: 'app-project-explorer',
	templateUrl: './project-explorer.component.html',
	styleUrls: ['./project-explorer.component.scss'],
})
export class ProjectExplorerComponent implements OnInit, OnDestroy {
	projectsList$: Observable<ProjectInfo[]>;
	activeProject$: Observable<Project | undefined>;
	projectExplorerState: ProjectExplorerExpandState = DEFAULT_PROJECT_EXPLORER_STATE;

	activeElementRef?: ProjectElementComponent;

	private sub = new Subscription();

	@Output() resize: EventEmitter<number> = new EventEmitter<number>();

	get maxResizeMovingX(): number {
		return window.innerWidth * 0.3;
	}

	constructor(private readonly store: Store,
				private readonly actions$: Actions,
				private readonly clipboard: ClipboardService,
				public readonly faucet: FaucetService,
				private readonly maiarWalletService: MaiarWalletService,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly ps: PersonalSettingsManager) {
		this.projectsList$ = this.store.select(ProjectSelector.projectList);
		this.activeProject$ = this.store.select(ProjectSelector.activeProject());

		this.sub.add(
			this.actions$.pipe(
				ofType(ProjectAction.updateProjectExplorerTreeSuccess),
				filter(action => !!action.isShowActiveTab),
			).subscribe(() => {
				setTimeout(() => this.activeElementRef?.containerRef?.nativeElement?.scrollIntoView({behavior: 'smooth'}), 0);
			}),
		);

		this.sub.add(
			this.activeProject$.subscribe(project => {
				if (project) {
					this.store.dispatch(ProjectAction.loadProjectExplorerState({
						projectId: project.id,
					}));
				}
			}),
		);

		this.sub.add(
			this.store.select(ProjectSelector.projectExplorerState).subscribe(state => this.projectExplorerState = state),
		)
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

	onExpandElement(projectId: string, componentType: ProjectComponentType, isExpanded: boolean): void {
		this.store.dispatch(ProjectAction.updateProjectExplorerTree({
			projectId,
			update: getUpdateExplorerStatePayload(componentType, isExpanded),
		}));
	}

	openProject(id: string): void {
		this.store.dispatch(ProjectAction.openProject({id}));
	}

	createProject(): void {
		this.store.dispatch(ProjectAction.createProject());
	}

	loadProjects(): void {
		this.store.dispatch(ProjectAction.loadProjectList());
	}

	generateWallet(projectId: string): void {
		this.store.dispatch(ProjectAction.generateWallet({projectId}));
	}

	openProjectComponent(title: string,
						 componentType: ProjectComponentType,
						 componentId: string): void {
		this.store.dispatch(ProjectAction.openProjectTab({title, componentType, componentId}));
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
		this.clipboard.copy(address, 'Wallet address');
	}

	exploreToken(projectId: string, identifier: string): void {
		this.store.dispatch(ProjectAction.exploreToken({projectId, identifier}));
	}

	deleteSmartContract(projectId: string, scId: string): void {
		this.store.dispatch(ProjectAction.deleteSmartContract({projectId, scId}));
	}

	uploadWasm(projectId: string, abiId: string): void {
		this.store.dispatch(ProjectAction.setWasm({projectId, abiId}));
	}

	deleteWasm(projectId: string, abiId: string): void {
		this.store.dispatch(ProjectAction.deleteWasm({projectId, abiId}));
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
