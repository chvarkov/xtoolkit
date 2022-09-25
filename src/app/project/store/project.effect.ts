import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectAction } from './project.action';
import { DATA_PROVIDER, DataProvider, ProjectScAbi } from '../../core/data-provider/data-provider';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { ModalDialogFactory } from '../../core/ui/dialog/modal-dialog.factory';
import { CreateProjectDialogComponent } from '../components/dialogs/create-project-dialog/create-project-dialog.component';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider';
import { Store } from '@ngrx/store';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { GenerateWalletDialogComponent } from '../components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import { UploadAbiDialogComponent } from '../components/dialogs/upload-abi-dialog/upload-abi-dialog.component';
import { AddTokenDialogComponent } from '../components/dialogs/add-token-dialog/add-token-dialog.component';
import { PERSONAL_SETTINGS_MANAGER, PersonalSettingsManager } from '../../core/data-provider/personal-settings.manager';
import { TransactionProvider } from '../../core/elrond/services/transaction.provider';
import { ElrondProxyProvider } from '../../core/elrond/services/elrond-proxy-provider';
import { joinNetwork } from './operators/join-network';
import { isValidAddress } from '../../core/validators/address-validator';
import { ExportMnemonicDialogComponent } from '../components/dialogs/export-mnemonic-dialog/export-mnemonic-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from '../../core/ui/rename-dialog/rename-dialog.component';

@Injectable()
export class ProjectEffect {
	loadProjects$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjects),
		switchMap(() => this.dataProvider.getProjects().pipe(
			map((data) => ProjectAction.loadProjectsSuccess({data})),
			catchError(err => of(ProjectAction.loadProjectsError({err})),
		)),
	)));

	createProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProject),
		switchMap(() => this.modalDialogFactory.show(CreateProjectDialogComponent).afterSubmit$()),
		switchMap(({ name, chainId }) => this.dataProvider.createProject(name, chainId).pipe(
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

	addWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addWallet),
		switchMap(({projectId, wallet}) => this.dataProvider.addWallet(projectId, wallet).pipe(
			map((project) => ProjectAction.addWalletSuccess({project, address: wallet.address})),
			catchError(err => of(ProjectAction.addWalletError({err})),
			)),
		)));

	deleteWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteWallet),
		switchMap(action => {
			return this.modalDialogFactory.show(ConfirmDialogComponent, {
				title: 'Delete wallet',
				message: 'Are you sure? After deletion, it will not be possible to restore.',
			}).afterSubmit$().pipe(
				map(() => action),
			);
		}),
		switchMap(({projectId, address}) => this.dataProvider.deleteWallet(projectId, address).pipe(
			map((project) => ProjectAction.deleteWalletSuccess({project})),
			catchError(err => of(ProjectAction.deleteWalletError({err})),
			)),
		)));

	generateWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.generateWallet),
		switchMap(({projectId}) => this.modalDialogFactory.show(GenerateWalletDialogComponent)
			.afterSubmit$()
			.pipe(
				map((wallet) => ProjectAction.addWallet({projectId, wallet}))
			),
		),
	));

	uploadAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.uploadAbi),
		switchMap(({projectId}) => this.modalDialogFactory.show(UploadAbiDialogComponent, {projectId}).afterSubmit$().pipe(
			map((data: ProjectScAbi) => ProjectAction.addAbi({
				projectId,
				name: data.name || data.abi.name,
				abi: data.abi,
			})),
		)),
	));

	setScAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.setScAddress),
		switchMap(({projectId, scId, address}) => this.dataProvider.setScAddress(
			projectId,
			scId,
			address,
		).pipe(
			map((project) => ProjectAction.setScAddressSuccess({project})),
			catchError(err => of(ProjectAction.setScAddressError({err}))),
		))),
	);

	addToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addToken),
		switchMap(({projectId}) => this.modalDialogFactory.show(AddTokenDialogComponent, {projectId})
			.afterSubmit$()
			.pipe(
				switchMap((tokenAddress: string) => this.dataProvider.addToken(projectId, tokenAddress).pipe(
					map((updatedProject) => ProjectAction.addTokenSuccess({project: updatedProject}))
				)),
			),
		),
		catchError(err => of(ProjectAction.addTokenError({err}))),
	));

	loadProjectTabs$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectTabs),
		switchMap(() => this.personalSettingsManager.getOpenedTabs().pipe(
			map((tabsData) => ProjectAction.loadProjectTabsSuccess({tabsData})),
			catchError(err => of(ProjectAction.loadProjectTabsError({err})))),
		),
	));

	openProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProjectTab),
		switchMap(({projectId, title, componentType, componentId}) => this.personalSettingsManager.openTab(projectId, title, componentType, componentId).pipe(
			map((tabsData) => ProjectAction.openProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.openProjectTabError({err})))),
		),
	));

	closeProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.closeProjectTab),
		switchMap(({index}) => this.personalSettingsManager.closeTab(index).pipe(
			map((tabsData) => ProjectAction.closeProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.closeProjectTabError({err})))),
		),
	));

	moveProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.moveProjectTab),
		switchMap(({prevIndex, currentIndex}) => this.personalSettingsManager.moveTab(prevIndex, currentIndex).pipe(
			map((tabsData) => ProjectAction.moveProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.moveProjectTabError({err})))),
		),
	));

	selectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.selectTab),
		switchMap(({index}) => this.personalSettingsManager.selectTab(index).pipe(
			map((tabsData) => ProjectAction.selectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.selectTabError({err})))),
		),
	));

	loadAccount$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadAccountAndPositions),
		filter(({address}) => !!address && isValidAddress(address)),
		joinNetwork(this.store),
		switchMap(([{address}, project, network]) => forkJoin([
			this.elrondDataProvider.getTokenPositions(network, address),
			from(this.elrondDataProvider.getProxy(network).getAccount(new Address(address))),
		]).pipe(
			map(([tokens , account]) => ProjectAction.loadAccountAndPositionsSuccess({
				projectId: project.id,
				native: account.balance.toString(),
				tokens,
				account,
			})),
			catchError(err => of(ProjectAction.loadAccountAndPositionsError({err})))
		))),
	);

	loadAccountTransactions$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadAccountTransactions),
		filter(({address}) => !!address && isValidAddress(address)),
		joinNetwork(this.store),
		switchMap(([{address}, project, network]) => this.txProvider.getTransactions(network, address).pipe(
			map((list) => ProjectAction.loadAccountTransactionsSuccess({
				projectId: project.id,
				address,
				list,
			})),
			catchError(err => of(ProjectAction.loadAccountTransactionsError({err})))
		))),
	);

	loadToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadToken),
		joinNetwork(this.store),
		switchMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getToken(network, identifier)).pipe(
			map((data) => ProjectAction.loadTokenSuccess({
				projectId: project.id,
				identifier,
				data,
			})),
			catchError(err => of(ProjectAction.loadTokenError({err})))
		))),
	);

	loadTokenHolders$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadTokenHolders),
		joinNetwork(this.store),
		switchMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenHolders(network, identifier, {})).pipe(
			map((data) => ProjectAction.loadTokenHoldersSuccess({
				projectId: project.id,
				identifier,
				data,
			})),
			catchError(err => of(ProjectAction.loadTokenHoldersError({err})))
		))),
	);

	loadTokenRoles$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadTokenHolders),
		joinNetwork(this.store),
		switchMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenRoles(network, identifier)).pipe(
			map((data) => ProjectAction.loadTokenRolesSuccess({
				projectId: project.id,
				identifier,
				data,
			})),
			catchError(err => of(ProjectAction.loadTokenRolesError({err})))
		))),
	);

	loadTokenTransfers$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadTokenTransfers),
		joinNetwork(this.store),
		switchMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenTransfers(network, identifier, {})).pipe(
			map((data) => ProjectAction.loadTokenTransfersSuccess({
				projectId: project.id,
				identifier,
				data,
			})),
			catchError(err => of(ProjectAction.loadTokenTransfersError({err})))
		))),
	);

	searchTokens$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.searchTokens),
		joinNetwork(this.store),
		switchMap(([{options}, project, network]) => from(this.elrondDataProvider.getTokens(network,options)).pipe(
			map((tokens) => ProjectAction.searchTokensSuccess({
				projectId: project.id,
				tokens,
			})),
			catchError(err => of(ProjectAction.searchTokensError({err})))
		))),
	);

	exportMnemonic$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.exportMnemonic),
		map(({ wallet }) => {
			this.modalDialogFactory.show(ExportMnemonicDialogComponent, wallet);
		}),
	), {dispatch: false});

	renameProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameProject),
		switchMap(({projectId}) => this.modalDialogFactory.show(RenameDialogComponent, {
			title: 'Rename project',
		}).afterSubmit$().pipe(
			map(({name}) => ({projectId, name})),
		)),
		switchMap(({projectId, name}) => this.dataProvider.renameProject(projectId, name).pipe(
			map((project) => ProjectAction.renameProjectSuccess({project})),
			catchError(err => of(ProjectAction.renameProjectError({err})))
		))),
	);

	renameWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameWallet),
		switchMap(({projectId, address}) => this.modalDialogFactory.show(RenameDialogComponent, {
			title: 'Rename wallet',
		}).afterSubmit$().pipe(
			map(({name}) => ({projectId, address, name})),
		)),
		switchMap(({projectId, address, name}) => this.dataProvider.renameWallet(projectId,address, name).pipe(
			map((project) => ProjectAction.renameWalletSuccess({project})),
			catchError(err => of(ProjectAction.renameWalletError({err})))
		))),
	);

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				private readonly modalDialogFactory: ModalDialogFactory,
				private readonly elrondDataProvider: ElrondDataProvider,
				private readonly elrondProxy: ElrondProxyProvider,
				private readonly txProvider: TransactionProvider,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManager: PersonalSettingsManager) {
	}
}
