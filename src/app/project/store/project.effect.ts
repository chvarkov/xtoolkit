import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectAction } from './project.action';
import { DATA_PROVIDER, DataProvider, ProjectScAbi } from '../../core/data-provider/data-provider';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { ModalDialogFactory } from '../../core/ui/dialog/modal-dialog.factory';
import { CreateProjectDialogComponent } from '../components/dialogs/create-project-dialog/create-project-dialog.component';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider.service';
import { NetworkSelector } from '../../network/store/network.selector';
import { Store } from '@ngrx/store';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { NetworkAction } from '../../network/store/network.action';
import { ProjectSelector } from './project.selector';
import { GenerateWalletDialogComponent } from '../components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { UploadAbiDialogComponent } from '../components/dialogs/upload-abi-dialog/upload-abi-dialog.component';
import { AddTokenDialogComponent } from '../components/dialogs/add-token-dialog/add-token-dialog.component';
import { PERSONAL_SETTINGS_MANAGER, PersonalSettingsManager } from '../../core/data-provider/personal-settings.manager';

@Injectable()
export class ProjectEffect {
	loadProjects$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjects),
		switchMap(() => this.dataProvider.getProjects().pipe(
			map((data) => ProjectAction.loadProjectsSuccess({data})),
			catchError(err => of(ProjectAction.loadProjectsError({err})),
		)),
	)));

	selectProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.selectProject),
		switchMap(({projectId}) => this.dataProvider.selectProject(projectId).pipe(
			map((project) => ProjectAction.selectProjectSuccess({project})),
			catchError(err => of(ProjectAction.selectProjectError({err})),
			)),
		)));

	createProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProject),
		switchMap(() => this.modalDialogFactory.show(CreateProjectDialogComponent).afterSubmit$()),
		switchMap((name: string) => this.dataProvider.createProject(name).pipe(
			map((project) => ProjectAction.createProjectSuccess({project})),
			catchError(err => of(ProjectAction.createProjectError({err})),
			)),
		)));

	addAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAbi),
		switchMap(({projectId, abi, name}) => this.dataProvider.addAbi(projectId, abi, name).pipe(
			map((project) => ProjectAction.addAbiSuccess({project})),
			catchError(err => of(ProjectAction.addAbiError({err})),
			)),
		)));

	loadPositions$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadPositions),
		withLatestFrom(this.store.select(NetworkSelector.selectedNetwork)),
		switchMap(([{ address }, network]) => forkJoin([
			this.elrondDataProvider.getTokenPositions(network, address),
			from(this.elrondDataProvider.getProxy(network).getAccount(new Address(address))),
		]).pipe(
			map(([tokens , account]) => ProjectAction.loadPositionsSuccess({
				address,
				native: account.balance.toString(),
				tokens
			})),
			catchError(err => of(ProjectAction.loadPositionsError({err})))
		))),
	);

	reloadPositionsOnChangeNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(NetworkAction.selectNetworkSuccess),
		withLatestFrom(this.store.select(ProjectSelector.getAddressesWithLoadedBalances)),
		switchMap(([network, addresses]) => of(...addresses.map(address => ProjectAction.loadPositions({address}))))
	));

	addWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addWallet),
		switchMap(({projectId, wallet}) => this.dataProvider.addWallet(projectId, wallet).pipe(
			map((project) => ProjectAction.addWalletSuccess({project, address: wallet.address})),
			catchError(err => of(ProjectAction.addWalletError({err})),
			)),
		)));

	addWalletSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addWalletSuccess),
		switchMap(({address}) => of(ProjectAction.loadPositions({address})))
	));

	generateWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.generateWallet),
		withLatestFrom(this.store.select(ProjectSelector.selectedProject)),
		switchMap(([_, project]) => this.modalDialogFactory.show(GenerateWalletDialogComponent)
			.afterSubmit$()
			.pipe(
				map((wallet) => ProjectAction.addWallet({projectId: project?.id || '', wallet}))
			),
		),
	));

	uploadAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.uploadAbi),
		withLatestFrom(this.store.select(ProjectSelector.selectedProject)),
		switchMap(([_, project]) => this.modalDialogFactory.show(UploadAbiDialogComponent).afterSubmit$().pipe(
			map((data: ProjectScAbi) => ProjectAction.addAbi({
				projectId: project?.id || '',
				name: data.name || data.abi.name,
				abi: data.abi,
			})),
		)),
	));

	setScAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.setScAddress),
		withLatestFrom(this.store.select(ProjectSelector.selectedProject)),
		switchMap(([{ scId, address }, project]) => this.dataProvider.setScAddress(
			project?.id || '',
			scId,
			address,
		).pipe(
			map((project) => ProjectAction.setScAddressSuccess({
				address,
				project,
			})),
			catchError(err => of(ProjectAction.setScAddressError({err}))),
		))),
	);

	selectSc$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.selectSc),
		withLatestFrom(this.store.select(ProjectSelector.selectedProject)),
		switchMap(([{ scId }, project]) => this.dataProvider.selectSc(project?.id || '', scId).pipe(
			map((project) => ProjectAction.selectScSuccess({project})),
		)),
		catchError(err => of(ProjectAction.selectScError({err}))),
	));

	addToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addToken),
		withLatestFrom(this.store.select(ProjectSelector.selectedProject)),
		switchMap(([_, project]) => this.modalDialogFactory.show(AddTokenDialogComponent)
			.afterSubmit$()
			.pipe(
				switchMap((tokenAddress: string) => this.dataProvider.addToken(project?.id || '', tokenAddress).pipe(
					map((updatedProject) => ProjectAction.addTokenSuccess({project: updatedProject}))
				)),
			),
		),
		catchError(err => of(ProjectAction.addTokenError({err}))),
	));

	loadProjectTabs$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectTabs),
		switchMap(() => this.personalSettingsManager.getOpenedTabs().pipe(
			map((tabs) => ProjectAction.loadProjectTabsSuccess({tabs})),
			catchError(err => of(ProjectAction.loadProjectTabsError({err})))),
		),
	));

	openProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProjectTab),
		switchMap(({title, componentType, componentId}) => this.personalSettingsManager.openTab(title, componentType, componentId).pipe(
			map((tabs) => ProjectAction.openProjectTabSuccess({tabs})),
			catchError(err => of(ProjectAction.openProjectTabError({err})))),
		),
	));

	closeProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.closeProjectTab),
		switchMap(({index}) => this.personalSettingsManager.closeTab(index).pipe(
			map((tabs) => ProjectAction.closeProjectTabSuccess({tabs})),
			catchError(err => of(ProjectAction.closeProjectTabError({err})))),
		),
	));

	moveProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.moveProjectTab),
		switchMap(({prevIndex, currentIndex}) => this.personalSettingsManager.moveTab(prevIndex, currentIndex).pipe(
			map((tabs) => ProjectAction.moveProjectTabSuccess({tabs})),
			catchError(err => of(ProjectAction.moveProjectTabError({err})))),
		),
	));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				private readonly modalDialogFactory: ModalDialogFactory,
				private readonly elrondDataProvider: ElrondDataProvider,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManager: PersonalSettingsManager) {
	}
}
