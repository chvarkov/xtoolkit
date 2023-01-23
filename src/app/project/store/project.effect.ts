import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectAction } from './project.action';
import {
	DATA_PROVIDER,
	DataProvider, ProjectAddress,
} from '../../core/data-provider/data-provider';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { CreateProjectDialogComponent } from '../components/dialogs/create-project-dialog/create-project-dialog.component';
import { ElrondDataProvider } from '../../core/elrond/elrond.data-provider';
import { Store } from '@ngrx/store';
import { Address } from '@elrondnetwork/erdjs-network-providers/out/primitives';
import {
	GenerateWalletDialogComponent,
	IGeneratedProjectWallet
} from '../components/dialogs/generate-wallet-dialog/generate-wallet-dialog.component';
import {
	IUploadedAbi,
	UploadAbiDialogComponent
} from '../components/dialogs/upload-abi-dialog/upload-abi-dialog.component';
import {
	getUpdateExplorerStatePayload,
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
import { IssueTokenDialogComponent } from '../components/dialogs/esdt/issue-token-dialog/issue-token-dialog.component';
import { UpdateProjectNetworkDialogComponent } from '../components/dialogs/update-project-network-dialog/update-project-network-dialog.component';
import { AddSmartContractDialogComponent } from '../components/dialogs/add-smart-contract-dialog/add-smart-contract-dialog.component';
import { AddProjectAddressDialogComponent } from '../components/dialogs/add-project-address-dialog/add-project-address-dialog.component';
import { ProjectSelector } from './project.selector';
import { MatDialog } from '@angular/material/dialog';
import { MintBurnTokenDialogComponent } from '../components/dialogs/esdt/mint-burn-token-dialog/mint-burn-token-dialog.component';
import { EsdtService } from '../services/esdt.service';
import { PauseTokenDialogComponent } from '../components/dialogs/esdt/pause-token-dialog/pause-token-dialog.component';
import { FreezeUnFreezeTokenDialogComponent } from '../components/dialogs/esdt/freeze-un-freeze-token-dialog/freeze-un-freeze-token-dialog.component';
import { WipeTokenDialogComponent } from '../components/dialogs/esdt/wipe-token-dialog/wipe-token-dialog.component';
import { SpecialRolesTokenDialogComponent } from '../components/dialogs/esdt/special-roles-token-dialog/special-roles-token-dialog.component';
import { TransferOwnershipDialogComponent } from '../components/dialogs/esdt/transfer-ownership-dialog/transfer-ownership-dialog.component';
import { TransferTokenDialogComponent } from '../../tabs-viewer/components/wallet-viewer/transfer-token-dialog/transfer-token-dialog.component';
import { SECRET_MANAGER, SecretManager } from '../../core/data-provider/secret.manager';
import { SecurityNgrxHelper } from '../../security/store/security.ngrx-helper';
import { MaiarWalletService } from '../services/maiar-wallet.service';
import { ToastrService } from 'ngx-toastr';
import { AddWasmDialogComponent } from '../components/dialogs/add-wasm-dialog/add-wasm-dialog.component';

@Injectable()
export class ProjectEffect {
	openProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProject),
		mergeMap(({id}) => this.dataProvider.openProject(id).pipe(
			switchMap((project) => [
				ProjectAction.openProjectSuccess({project}),
				ProjectAction.loadProjectTabs(),
			]),
			catchError(err => of(ProjectAction.openProjectError({err})))
		)),
	));

	closeProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.closeProject),
		mergeMap(() => this.dataProvider.closeProject().pipe(
			switchMap(() => [
				ProjectAction.closeProjectSuccess(),
				ProjectAction.loadProjectTabs(),
			]),
			catchError(err => of(ProjectAction.closeProjectError({err})))
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

	updateProjectNetworkSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.updateProjectNetworkSuccess),
		tap(() => this.toastrService.success('Project network was successful updated', 'Update project network')),
	), {dispatch: false});

	updateProjectNetworkError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.updateProjectNetworkError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot update project network')),
	), {dispatch: false});

	createProject$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProject),
		exhaustMap(() => this.dialog.open(CreateProjectDialogComponent, {width: '300px'}).afterClosed()),
		filter(v => !!v),
		mergeMap(({ name, chainId }) => this.dataProvider.createProject(name, chainId).pipe(
			map((project) => ProjectAction.createProjectSuccess({project})),
			catchError(err => of(ProjectAction.createProjectError({err})),
			)),
		)));

	createProjectSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProjectSuccess),
		tap(() => this.toastrService.success('Project was successful created', 'Create project')),
	), {dispatch: false});

	createProjectError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.createProjectError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot create project')),
	), {dispatch: false});

	addAbi$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAbi),
		mergeMap(({projectId, abi, name}) => this.dataProvider.addAbi(projectId, abi, name).pipe(
			map((project) => ProjectAction.addAbiSuccess({project})),
			catchError(err => of(ProjectAction.addAbiError({err})),
			)),
		)));

	loadWasm$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadWasm),
		mergeMap(({projectId, abiId}) => this.dataProvider.getWasm(projectId, abiId).pipe(
			map((wasm) => ProjectAction.loadWasmSuccess({abiId, wasm})),
			catchError(err => of(ProjectAction.loadWasmError({err})),
			)),
		)));

	setWasm$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.setWasm),
		exhaustMap(({projectId, abiId}) => this.dialog.open(AddWasmDialogComponent, {
			data: {projectId, abiId},
		}).afterClosed().pipe(
			filter(v => !!v),
		)),
		mergeMap(({projectId, abiId, wasm}) => this.dataProvider.setWasm(projectId, abiId, wasm).pipe(
			map((project) => ProjectAction.setWasmSuccess({project})),
			catchError(err => of(ProjectAction.setWasmError({err})),
			)),
		)));

	deleteWasm$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteWasm),
		exhaustMap(action => {
			return this.dialog.open(ConfirmDialogComponent, {
				data: {
					title: 'Delete WASM code',
					message: 'Are you sure? After deletion, it will not be possible to restore.',
				},
			}).afterClosed().pipe(
				filter(v => !!v),
				map(() => action),
			);
		}),
		mergeMap(({projectId, abiId}) => this.dataProvider.deleteWasm(projectId, abiId).pipe(
			map((project) => ProjectAction.deleteWasmSuccess({project})),
			catchError(err => of(ProjectAction.deleteWasmError({err})),
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
				switchMap((generatedProjectWallet: IGeneratedProjectWallet) => SecurityNgrxHelper
					.resolvePasswordHash(this.store, this.dialog, this.secretManager).pipe(
						map(passwordHash => [generatedProjectWallet, passwordHash] as [IGeneratedProjectWallet, string]),
					),
				),
				switchMap(([generatedProjectWallet, passwordHash]: [IGeneratedProjectWallet, string]) => {
					return this.secretManager.setWalletSecret(
						passwordHash,
						projectId,
						generatedProjectWallet.wallet.address,
						generatedProjectWallet.mnemonic,
					).pipe(
						map(() => generatedProjectWallet.wallet),
					);
				}),
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
		exhaustMap(({projectId}) => this.dialog.open(AddSmartContractDialogComponent, {
			data: {projectId},
			width: '320px',
		}).afterClosed().pipe(
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
			width: '480px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.issueFungibleToken(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.issueTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.issueTokenError({err}))),
	));

	mintToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.mintToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(MintBurnTokenDialogComponent, {
			data: {projectId, identifier, isMint: true},
			width: '320px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.mint(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.mintTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.mintTokenError({err}))),
	));

	burnToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.burnToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(MintBurnTokenDialogComponent, {
			data: {projectId, identifier, isMint: false},
			width: '320px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.burn(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.burnTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.burnTokenError({err}))),
	));

	pauseToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.pauseToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(PauseTokenDialogComponent, {
			data: {projectId, identifier, isPause: true},
			width: '320px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.pause(projectId, network, wallet, options.identifier).pipe(
			map(() => ProjectAction.pauseTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.pauseTokenError({err}))),
	));

	unpauseToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.unPauseToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(PauseTokenDialogComponent, {
			data: {projectId, identifier, isPause: false},
			width: '500px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.unPause(projectId, network, wallet, options.identifier).pipe(
			map(() => ProjectAction.unPauseTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.unPauseTokenError({err}))),
	));

	freezeToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.freezeToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(FreezeUnFreezeTokenDialogComponent, {
			data: {projectId, identifier, isFreeze: true},
			width: '640px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.freeze(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.freezeTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.freezeTokenError({err}))),
	));

	unFreezeToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.unFreezeToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(FreezeUnFreezeTokenDialogComponent, {
			data: {projectId, identifier, isFreeze: false},
			width: '640px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.unFreeze(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.unFreezeTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.unFreezeTokenError({err}))),
	));

	wipeToken$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.wipeToken),
		exhaustMap(({projectId, identifier}) => this.dialog.open(WipeTokenDialogComponent, {
			data: {projectId, identifier},
			width: '640px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.wipe(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.wipeTokenSuccess()),
		)),
		catchError(err => of(ProjectAction.wipeTokenError({err}))),
	));

	setTokenSpecialRole$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.setTokenSpecialRole),
		exhaustMap(({projectId, identifier}) => this.dialog.open(SpecialRolesTokenDialogComponent, {
			data: {projectId, identifier},
			width: '640px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.setSpecialRoles(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.setTokenSpecialRoleSuccess()),
		)),
		catchError(err => of(ProjectAction.setTokenSpecialRoleError({err}))),
	));

	transferTokenOwnership$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.transferTokenOwnership),
		exhaustMap(({projectId, identifier}) => this.dialog.open(TransferOwnershipDialogComponent, {
			data: {projectId, identifier},
			width: '640px',
		}).afterClosed()),
		filter(v => !!v),
		switchMap(([projectId, network, wallet, options]) => this.esdtService.transferOwnership(projectId, network, wallet, options).pipe(
			map(() => ProjectAction.transferTokenOwnershipSuccess()),
		)),
		catchError(err => of(ProjectAction.transferTokenOwnershipError({err}))),
	));

	loadProjectTabs$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadProjectTabs),
		mergeMap(() => this.personalSettingsManager.getActiveProjectOpenedTabs().pipe(
			map((tabsData) => ProjectAction.loadProjectTabsSuccess({tabsData})),
			catchError(err => of(ProjectAction.loadProjectTabsError({err})))),
		),
	));

	openProjectTab$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.openProjectTab),
		mergeMap(({title, componentType, componentId}) => this.personalSettingsManager.openTab(title, componentType, componentId).pipe(
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
			map(([project, list]) => ProjectAction.renameProjectSuccess({project, list})),
			catchError(err => of(ProjectAction.renameProjectError({err})))
		))),
	);

	renameProjectSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameProjectSuccess),
		tap(() => this.toastrService.success('Project successful renamed', 'Rename project')),
	), {dispatch: false});

	renameProjectError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameProjectError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot rename project')),
	), {dispatch: false});

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

	renameSmartContractSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameSmartContractSuccess),
		tap(() => this.toastrService.success('Smart contract successful renamed', 'Rename smart contract')),
	), {dispatch: false});

	renameSmartContractError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameSmartContractError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot rename smart contract')),
	), {dispatch: false});

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

	renameAbiSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAbiSuccess),
		tap(() => this.toastrService.success('ABI interface successful renamed', 'Rename ABI interface')),
	), {dispatch: false});

	renameAbiError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAbiError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot rename ABI interface')),
	), {dispatch: false});

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

	renameWalletSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameWalletSuccess),
		tap(() => this.toastrService.success('Wallet successful renamed', 'Rename wallet')),
	), {dispatch: false});

	renameWalletError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameWalletError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot rename wallet')),
	), {dispatch: false});

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

	deleteProjectSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteProjectSuccess),
		tap(() => this.toastrService.success('Project was successful deleted', 'Delete project')),
	), {dispatch: false});

	deleteProjectError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.deleteProjectError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot delete project')),
	), {dispatch: false});

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

	addProjectAddress$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAddress),
		exhaustMap(action => {
			return this.dialog.open(AddProjectAddressDialogComponent, {
				width: '640px',
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

	addProjectAddressSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAddressSuccess),
		tap(() => this.toastrService.success('Address successful added to address book', 'Add address')),
	), {dispatch: false});

	addProjectAddressError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.addAddressError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot add address')),
	), {dispatch: false});

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

	renameAddressSuccess$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAddressSuccess),
		tap(() => this.toastrService.success('Address successful renamed', 'Rename address')),
	), {dispatch: false});

	renameAddressError$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.renameAddressError),
		tap(() => this.toastrService.error('Something went wrong, please refresh the page and try again', 'Cannot rename address')),
	), {dispatch: false});

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
		mergeMap(({projectId}) => this.personalSettingsManager.getProjectExplorerState(projectId).pipe(
			map((explorerState) => ProjectAction.loadProjectExplorerStateSuccess({explorerState})),
			catchError(err => of(ProjectAction.loadProjectExplorerStateError({err})))
		))),
	);

	updateProjectExplorerTree$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.updateProjectExplorerTree),
		mergeMap(({projectId, update, isShowActiveTab}) => this.personalSettingsManager.updateProjectExplorerTree(projectId, update).pipe(
			map((data) => ProjectAction.updateProjectExplorerTreeSuccess({data, isShowActiveTab})),
			catchError(err => of(ProjectAction.updateProjectExplorerTreeError({err})))
		))),
	);

	showCurrentTabInExplorer$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.showCurrentTabInExplorer),
		switchMap(({projectId}) => this.store.select(ProjectSelector.activeTab).pipe(
			take(1),
			map(opened => {
				if (!opened) {
					throw new Error('No tab');
				}

				return ProjectAction.updateProjectExplorerTree({
					projectId,
					update: getUpdateExplorerStatePayload(opened.componentType, true),
					isShowActiveTab: true,
				});
			}),
		)),
	));

	loadAccountNfts$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.loadAccountNfts),
		joinNetwork(this.store),
		mergeMap(([{address}, project, network]) => this.elrondDataProvider.getAccountNfts(network, address).pipe(
			map((data) => ProjectAction.loadAccountNftsSuccess({data, address})),
			catchError(err => of(ProjectAction.loadAccountNftsError({err})))
		)),
	));

	transferTokens$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.transferTokens),
		joinNetwork(this.store),
		exhaustMap(([action, project, network]) => {
			return this.dialog.open(TransferTokenDialogComponent, {
				data: {
					projectId: action.projectId,
					chainId: action.chainId,
				},
				width: '660px',
			}).afterClosed().pipe(
				filter(v => !!v),
				map((options) => [action.projectId, network, options]),
			);
		}),
		mergeMap(([projectId, network, options]) => this.esdtService.transferFunds(projectId, network, options).pipe(
			map(() => ProjectAction.transferTokensSuccess()),
			catchError(err => of(ProjectAction.transferTokensError({err})))
		)),
	));

	connectMaiarWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.connectMaiarWallet),
		switchMap(() => this.maiarWalletService.connectWallet().pipe(
			map(address => ProjectAction.connectMaiarWalletSuccess({address})),
			catchError(err => of(ProjectAction.connectMaiarWalletError({err})))
		)),
	));

	logoutMaiarWallet$ = createEffect(() => this.actions$.pipe(
		ofType(ProjectAction.logoutMaiarWallet),
		switchMap(() => this.maiarWalletService.logout().pipe(
			map(() => ProjectAction.logoutMaiarWalletSuccess()),
			catchError(err => of(ProjectAction.logoutMaiarWalletError({err}))),
		)),
	));

	constructor(private readonly actions$: Actions,
				private readonly store: Store,
				private readonly elrondDataProvider: ElrondDataProvider,
				private readonly elrondProxy: ElrondProxyProvider,
				private readonly txProvider: TransactionProvider,
				private readonly dialog: MatDialog,
				private readonly esdtService: EsdtService,
				private readonly maiarWalletService: MaiarWalletService,
				private readonly toastrService: ToastrService,
				@Inject(SECRET_MANAGER) private readonly secretManager: SecretManager,
				@Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider,
				@Inject(PERSONAL_SETTINGS_MANAGER) private readonly personalSettingsManager: PersonalSettingsManager) {
	}
}
