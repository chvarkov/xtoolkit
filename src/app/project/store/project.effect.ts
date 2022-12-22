import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectAction } from './project.action';
import {
	ActionHistoryElement,
	DATA_PROVIDER,
	DataProvider, ProjectAddress,
} from '../../core/data-provider/data-provider';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { CreateProjectDialogComponent } from '../components/dialogs/create-project-dialog/create-project-dialog.component';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider';
import { Store } from '@ngrx/store';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import { GenerateWalletDialogComponent } from '../components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import {
	IUploadedAbi,
	UploadAbiDialogComponent
} from '../components/dialogs/upload-abi-dialog/upload-abi-dialog.component';
import {
	getProjectComponentNodeId,
	PERSONAL_SETTINGS_MANAGER,
	PersonalSettingsManager
} from '../../core/data-provider/personal-settings.manager';
import { TransactionProvider } from '../../core/elrond/services/transaction.provider';
import { ElrondProxyProvider } from '../../core/elrond/services/elrond-proxy-provider';
import { joinNetwork } from './operators/join-network';
import { isValidAddress } from '../../core/validators/address-validator';
import { ExportMnemonicDialogComponent } from '../components/dialogs/export-mnemonic-dialog/export-mnemonic-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from '../../core/ui/rename-dialog/rename-dialog.component';
import { ImportTokenDialogComponent } from '../components/dialogs/import-token-dialog/import-token-dialog.component';
import { IssueTokenDialogComponent } from '../components/dialogs/issue-token-dialog/issue-token-dialog.component';
import { ActionHistoryAction } from '../../action-history/store/action-history.action';
import { UpdateProjectNetworkDialogComponent } from '../components/dialogs/update-project-network-dialog/update-project-network-dialog.component';
import { AddSmartContractDialogComponent } from '../components/dialogs/add-smart-contract-dialog/add-smart-contract-dialog.component';
import { AddProjectAddressDialogComponent } from '../components/dialogs/add-project-address-dialog/add-project-address-dialog.component';
import { ProjectSelector } from './project.selector';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ProjectEffect {
	openProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProject),
		mergeMap(({id}) => this.dataProvider.openProject(id).pipe(
			map((project) => ProjectAction.openProjectSuccess({project})),
			catchError(err => of(ProjectAction.openProjectError({err})))
		)),
	));

	loadActiveProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadActiveProject),
		mergeMap(() => this.dataProvider.getActiveProject().pipe(
			map((data) => ProjectAction.loadActiveProjectSuccess({data})),
			catchError(err => of(ProjectAction.loadActiveProjectError({err})))
		)),
	));

	loadProjectList$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectList),
		mergeMap(() => this.dataProvider.getProjectList().pipe(
			map((data) => ProjectAction.loadProjectListSuccess({data})),
			catchError(err => of(ProjectAction.loadProjectListError({err}))),
		)),
	));

	updateProjectNetwork$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.updateProjectNetwork),
		exhaustMap(({projectId}) => this.dialog.open(UpdateProjectNetworkDialogComponent, {width: '360px'}).afterClosed().pipe(
			filter(v => !!v),
			map(chainId => ({projectId, chainId})),
		)),
		mergeMap(({projectId, chainId}) => this.dataProvider.updateProjectNetwork(projectId, chainId).pipe(
			map((project) => ProjectAction.updateProjectNetworkSuccess({project})),
			catchError(err => of(ProjectAction.updateProjectNetworkError({err})),
			)),
		)));

	createProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProject),
		exhaustMap(() => this.dialog.open(CreateProjectDialogComponent, {width: '300px'}).afterClosed()),
		filter(v => !!v),
		mergeMap(({ name, chainId }) => this.dataProvider.createProject(name, chainId).pipe(
			map((project) => ProjectAction.createProjectSuccess({project})),
			catchError(err => of(ProjectAction.createProjectError({err})),
			)),
		)));

	addAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAbi),
		mergeMap(({projectId, abi, name}) => this.dataProvider.addAbi(projectId, abi, name).pipe(
			map((project) => ProjectAction.addAbiSuccess({project})),
			catchError(err => of(ProjectAction.addAbiError({err})),
			)),
		)));

	addWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addWallet),
		mergeMap(({projectId, wallet}) => this.dataProvider.addWallet(projectId, wallet).pipe(
			map((project) => ProjectAction.addWalletSuccess({project, address: wallet.address})),
			catchError(err => of(ProjectAction.addWalletError({err})),
			)),
		)));

	generateWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.generateWallet),
		exhaustMap(({projectId}) => this.dialog.open(GenerateWalletDialogComponent)
			.afterClosed()
			.pipe(
				filter(v => !!v),
				map((wallet) => ProjectAction.addWallet({projectId, wallet}))
			),
		),
	));

	uploadAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.uploadAbi),
		exhaustMap(({projectId}) => this.dialog.open(UploadAbiDialogComponent, {data: {projectId}}).afterClosed().pipe(
			filter(v => !!v),
			map((data: IUploadedAbi) => ProjectAction.addAbi({
				projectId,
				name: data.name,
				abi: data.content,
			})),
		)),
	));

	addSmartContract$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addSmartContract),
		exhaustMap(({projectId}) => this.dialog.open(AddSmartContractDialogComponent, {data: {projectId}}).afterClosed().pipe(
			filter(v => !!v),
			map(({ name, address, abiId }) => ({
				projectId,
				name,
				address,
				abiId,
			})),
		)),
		mergeMap(({projectId, name, address, abiId}) => this.dataProvider.createSmartContract(projectId, abiId, name, address).pipe(
			map((project) => ProjectAction.addSmartContractSuccess({project})),
			catchError(err => of(ProjectAction.addSmartContractError({err})))),
		),
	));

	setScAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.setScAddress),
		mergeMap(({projectId, scId, address}) => this.dataProvider.setScAddress(
			projectId,
			scId,
			address,
		).pipe(
			map((project) => ProjectAction.setScAddressSuccess({project})),
			catchError(err => of(ProjectAction.setScAddressError({err}))),
		))),
	);

	importToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.importToken),
		exhaustMap(({projectId}) => this.dialog.open(ImportTokenDialogComponent, {
			data: {projectId},
		})
			.afterClosed()
			.pipe(
				filter(v => !!v),
				map((identifier) => ProjectAction.addToken({projectId, identifier})),
			),
		),
	));

	addToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addToken),
		mergeMap(({projectId, identifier}) => this.dataProvider.addToken(projectId, identifier).pipe(
			map(() => ProjectAction.addTokenSuccess({projectId, identifier}))
		)),
		catchError(err => of(ProjectAction.addTokenError({err}))),
	));

	issueToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.issueToken),
		exhaustMap(({projectId}) => this.dialog.open(IssueTokenDialogComponent, {
			data: {projectId},
		})
			.afterClosed()
			.pipe(
				filter(v => !!v),
				switchMap((data: ActionHistoryElement) => of(
					ProjectAction.addTokenIssueTxToWaitList({
						data: {
							projectId: data.projectId,
							txHash: data.txHash || '',
							actionId: data.id,
							chainId: data.chainId,
						},
					}),
					ActionHistoryAction.logAction({ data }),
				)),
			),
		),
		catchError(err => of(ProjectAction.addTokenError({err}))),
	));

	loadProjectTabs$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectTabs),
		mergeMap(() => this.personalSettingsManager.getOpenedTabs().pipe(
			map((tabsData) => ProjectAction.loadProjectTabsSuccess({tabsData})),
			catchError(err => of(ProjectAction.loadProjectTabsError({err})))),
		),
	));

	openProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProjectTab),
		mergeMap(({projectId, title, componentType, componentId}) => this.personalSettingsManager.openTab(projectId, title, componentType, componentId).pipe(
			map((tabsData) => ProjectAction.openProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.openProjectTabError({err})))),
		),
	));

	pushProjectTabAsFirst$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.pushProjectTabAsFirst),
		mergeMap(({index}) => this.personalSettingsManager.pushTabAsFirst(index).pipe(
			map((tabsData) => ProjectAction.pushProjectTabAsFirstSuccess({tabsData})),
			catchError(err => of(ProjectAction.pushProjectTabAsFirstError({err})))),
		),
	));

	closeProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.closeProjectTab),
		mergeMap(({index}) => this.personalSettingsManager.closeTab(index).pipe(
			map((tabsData) => ProjectAction.closeProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.closeProjectTabError({err})))),
		),
	));

	moveProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.moveProjectTab),
		mergeMap(({prevIndex, currentIndex}) => this.personalSettingsManager.moveTab(prevIndex, currentIndex).pipe(
			map((tabsData) => ProjectAction.moveProjectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.moveProjectTabError({err})))),
		),
	));

	selectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.selectTab),
		mergeMap(({index}) => this.personalSettingsManager.selectTab(index).pipe(
			map((tabsData) => ProjectAction.selectTabSuccess({tabsData})),
			catchError(err => of(ProjectAction.selectTabError({err})))),
		),
	));

	loadAccount$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadAccountAndPositions),
		filter(({address}) => !!address && isValidAddress(address)),
		joinNetwork(this.store),
		mergeMap(([{address}, project, network]) => forkJoin([
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
		mergeMap(([{address}, project, network]) => this.txProvider.getTransactions(network, address).pipe(
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
		mergeMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getToken(network, identifier)).pipe(
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
		mergeMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenHolders(network, identifier, {})).pipe(
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
		mergeMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenRoles(network, identifier)).pipe(
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
		mergeMap(([{identifier}, project, network]) => from(this.elrondDataProvider.getTokenTransfers(network, identifier, {})).pipe(
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
		mergeMap(([{options}, project, network]) => from(this.elrondDataProvider.getTokens(network,options)).pipe(
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
			this.dialog.open(ExportMnemonicDialogComponent, {data: wallet});
		}),
	), {dispatch: false});

	renameProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameProject),
		exhaustMap(({projectId, name}) => this.dialog.open(RenameDialogComponent, {
			data: {title: 'Rename project', name},
			width: '340px',
		}).afterClosed().pipe(
			filter(v => !!v),
			map(({name}) => ({projectId, name})),
		)),
		mergeMap(({projectId, name}) => this.dataProvider.renameProject(projectId, name).pipe(
			map((project) => ProjectAction.renameProjectSuccess({project})),
			catchError(err => of(ProjectAction.renameProjectError({err})))
		))),
	);

	renameSmartContract$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameSmartContract),
		exhaustMap(({projectId, scId, name}) => this.dialog.open(RenameDialogComponent, {
			data: {title: 'Rename smart contract', name},
			width: '360px',
		}).afterClosed().pipe(
			filter(v => !!v),
			map(({name}) => ({projectId, scId, name})),
		)),
		mergeMap(({projectId, scId, name}) => forkJoin([
			this.dataProvider.renameSmartContract(projectId, scId, name),
			this.personalSettingsManager.rename(projectId, 'sc', scId, name),
		]).pipe(
			map(([project, { tabs }]) => ProjectAction.renameSmartContractSuccess({project, tabs})),
			catchError(err => of(ProjectAction.renameSmartContractError({err})))
		))),
	);

	renameAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAbi),
		exhaustMap(({projectId, abiId, name}) => this.dialog.open(RenameDialogComponent, {
			data: {title: 'Rename ABI interface', name},
			width: '360px',
		}).afterClosed().pipe(
			filter(v => !!v),
			map(({name}) => ({projectId, abiId, name})),
		)),
		mergeMap(({projectId, abiId, name}) => forkJoin([
			this.dataProvider.renameAbi(projectId, abiId, name),
			this.personalSettingsManager.rename(projectId, 'abi', abiId, name),
		]).pipe(
			map(([project, { tabs }]) => ProjectAction.renameAbiSuccess({project, tabs})),
			catchError(err => of(ProjectAction.renameAbiError({err})))
		))),
	);

	renameWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameWallet),
		exhaustMap(({projectId, address, name}) => this.dialog.open(RenameDialogComponent, {
			data: {title: 'Rename wallet', name},
			width: '340px',
		}).afterClosed().pipe(
			filter(v => !!v),
			map(({name}) => ({projectId, address, name})),
		)),
		mergeMap(({projectId, address, name}) => forkJoin([
			this.dataProvider.renameWallet(projectId, address, name),
			this.personalSettingsManager.rename(projectId, 'wallet', address, name),
		]).pipe(
			map(([project, {tabs}]) => ProjectAction.renameWalletSuccess({project, tabs})),
			catchError(err => of(ProjectAction.renameWalletError({err})))
		))),
	);

	exploreToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.exploreToken),
		joinNetwork(this.store),
		map(([{identifier}, _, network]) => window.open(`${network.explorerUrl}/tokens/${identifier}`)),
	), {dispatch: false});

	deleteProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteProject),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete project',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId}) => forkJoin([
			this.dataProvider.deleteProject(projectId),
			this.personalSettingsManager.deleteComponent(projectId, 'project', projectId),
		]).pipe(
			map(([_, tabsData]) => ProjectAction.deleteProjectSuccess({projectId, tabsData})),
			catchError(err => of(ProjectAction.deleteProjectError({err})),
			)),
		)));

	deleteSmartContract$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteSmartContract),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete smart contract',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, scId}) => forkJoin([
			this.dataProvider.deleteSmartContract(projectId, scId),
			this.personalSettingsManager.deleteComponent(projectId, 'sc', scId),
		]).pipe(
			map(([project, tabsData]) => ProjectAction.deleteSmartContractSuccess({project, tabsData})),
			catchError(err => of(ProjectAction.deleteSmartContractError({err})),
			)),
		)));

	deleteAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteAbi),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete ABI interface',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, abiId}) => forkJoin([
			this.dataProvider.deleteAbi(projectId, abiId),
			this.personalSettingsManager.deleteComponent(projectId, 'abi', abiId),
		]).pipe(
			map(([project, tabsData]) => ProjectAction.deleteAbiSuccess({project, tabsData})),
			catchError(err => of(ProjectAction.deleteAbiError({err})),
			)),
		)));

	deleteToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteToken),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete token',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, identifier}) => forkJoin([
			this.dataProvider.deleteToken(projectId, identifier),
			this.personalSettingsManager.deleteComponent(projectId, 'token', identifier),
		]).pipe(
			map(([project, tabsData]) => ProjectAction.deleteTokenSuccess({project, tabsData})),
			catchError(err => of(ProjectAction.deleteTokenError({err})),
			)),
		)));

	deleteWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteWallet),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete wallet',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, address}) => forkJoin([
			this.dataProvider.deleteWallet(projectId, address),
				this.personalSettingsManager.deleteComponent(projectId, 'wallet', address),
		]).pipe(
			map(([project, tabsData]) => ProjectAction.deleteWalletSuccess({project, tabsData})),
			catchError(err => of(ProjectAction.deleteWalletError({err})),
			)),
		)));

	addAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAddress),
		exhaustMap(action => {
			return this.dialog.open(AddProjectAddressDialogComponent, {
				data: {
					projectId: action.projectId,
				},
			}).afterClosed();
		}),
		filter(v => !!v),
		mergeMap((address: ProjectAddress) => this.dataProvider.addProjectAddress(address).pipe(
			map((project) => ProjectAction.addAddressSuccess({project})),
			catchError(err => of(ProjectAction.addAddressError({err}))),
		)),
	));

	renameAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAddress),
		exhaustMap(({projectId, address, name}) => this.dialog.open(RenameDialogComponent, {
			data: {title: 'Rename address', name},
			width: '340px',
		}).afterClosed().pipe(
			filter(v => !!v),
			map(({name}) => ({projectId, address, name})),
		)),
		mergeMap(({projectId, address, name}) => this.dataProvider.renameProjectAddress(projectId, address, name).pipe(
			map((project) => ProjectAction.renameAddressSuccess({project})),
			catchError(err => of(ProjectAction.renameAddressError({err})))
		))),
	);

	deleteAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteAddress),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete address',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, address}) => this.dataProvider.deleteProjectAddress(projectId, address).pipe(
			map((project) => ProjectAction.deleteAddressSuccess({project})),
			catchError(err => of(ProjectAction.deleteAddressError({err})))
		))),
	);

	loadTokenIssueWaitList$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadTokenIssueWaitList),
		mergeMap(() => this.dataProvider.getTokenIssueWaitList().pipe(
			map((waitList) => ProjectAction.loadTokenIssueWaitListSuccess({waitList})),
			catchError(err => of(ProjectAction.loadTokenIssueWaitListError({err})))
		))),
	);

	addTokenIssueTxToWaitList$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addTokenIssueTxToWaitList),
		mergeMap(({data}) => this.dataProvider.addTokenIssueTransaction(data).pipe(
			map((waitList) => ProjectAction.addTokenIssueTxToWaitListSuccess({waitList})),
			catchError(err => of(ProjectAction.addTokenIssueTxToWaitListError({err})))
		))),
	);

	deleteTokenIssueTxFromWaitList$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteTokenIssueTxFromWaitList),
		mergeMap(({txHash}) => this.dataProvider.deleteTokenIssueTransaction(txHash).pipe(
			map((waitList) => ProjectAction.deleteTokenIssueTxFromWaitListSuccess({waitList})),
			catchError(err => of(ProjectAction.deleteTokenIssueTxFromWaitListError({err})))
		))),
	);

	loadTransaction$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadTransaction),
		joinNetwork(this.store),
		mergeMap(([{ txHash }, project, network]) => this.elrondDataProvider.getTransaction(network, txHash).pipe(
			map((tx) => ProjectAction.loadTransactionSuccess({projectId: project.id, tx})),
			catchError(err => of(ProjectAction.loadTransactionError({err})))
		))),
	);

	loadProjectExplorerState$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectExplorerState),
		mergeMap(() => this.personalSettingsManager.getProjectExplorerState().pipe(
			map((explorerState) => ProjectAction.loadProjectExplorerStateSuccess({explorerState})),
			catchError(err => of(ProjectAction.loadProjectExplorerStateError({err})))
		))),
	);

	updateProjectExplorerTree$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.updateProjectExplorerTree),
		mergeMap(({nodeId, isExpanded, withParents, withChildren, isShowActiveTab}) => this.personalSettingsManager.updateProjectExplorerTree(
			nodeId,
			isExpanded,
			withParents,
			withChildren,
		).pipe(
			map((explorerState) => ProjectAction.updateProjectExplorerTreeSuccess({explorerState, isShowActiveTab})),
			catchError(err => of(ProjectAction.updateProjectExplorerTreeError({err})))
		))),
	);

	syncProjectExplorerTree$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.syncProjectExplorerTree),
		mergeMap(() => this.personalSettingsManager.getProjectExplorerState().pipe(
			map((explorerState) => ProjectAction.syncProjectExplorerTreeSuccess({explorerState})),
			catchError(err => of(ProjectAction.syncProjectExplorerTreeError({err})))
		))),
	);

	showCurrentTabInExplorer$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.showCurrentTabInExplorer),
		switchMap((args) => this.store.select(ProjectSelector.activeTab).pipe(
			take(1),
			map(opened => {
				if (!opened) {
					throw new Error('No tab');
				}

				const nodeId = getProjectComponentNodeId(opened.projectId, opened.componentType, opened.componentId);
				return ProjectAction.updateProjectExplorerTree({
					nodeId,
					withChildren: false,
					withParents: true,
					isExpanded: true,
					isShowActiveTab: true,
				});
			}),
		)),
	));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				private readonly elrondDataProvider: ElrondDataProvider,
				private readonly elrondProxy: ElrondProxyProvider,
				private readonly txProvider: TransactionProvider,
				private readonly dialog: MatDialog,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManager: PersonalSettingsManager) {
	}
}
