import { createAction, props } from '@ngrx/store';
import { GeneratedWallet, PendingTokenIssue, Project } from '../../core/data-provider/data-provider';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { ProjectComponentType } from '../../core/types';
import { OpenedProjectTab, ProjectExplorerState, TabsData } from '../../core/data-provider/personal-settings.manager';
import { AbiJson } from '../../core/elrond/builders/sc.builder';
import { IElrondFullTransaction, IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { ITokenInfo } from '../../core/elrond/interfaces/token-info';
import { ITokenHolder } from '../../core/elrond/interfaces/token-holder';
import { ITokenRole } from '../../core/elrond/interfaces/token-role';
import { ITokenTransfer } from '../../core/elrond/interfaces/token-transfer';
import { ITokenSearchOptions } from '../../core/elrond/interfaces/token-search-options';

export class ProjectAction {
	static readonly loadProjects = createAction(`[${ProjectAction.name}] load projects [...]`);
	static readonly loadProjectsSuccess = createAction(`[${ProjectAction.name}] load projects [OK]`, props<{data: Project[]}>());
	static readonly loadProjectsError = createAction(`[${ProjectAction.name}] load projects [ERR]`, props<{err: Error}>());

	static readonly updateProjectNetwork = createAction(`[${ProjectAction.name}] update project network [...]`, props<{projectId: string}>());
	static readonly updateProjectNetworkSuccess = createAction(`[${ProjectAction.name}] update project network [OK]`, props<{project: Project}>());
	static readonly updateProjectNetworkError = createAction(`[${ProjectAction.name}] update project network [ERR]`, props<{err: Error}>());

	static readonly createProject = createAction(`[${ProjectAction.name}] create project [...]`);
	static readonly createProjectSuccess = createAction(`[${ProjectAction.name}] create project [OK]`, props<{project: Project}>());
	static readonly createProjectError = createAction(`[${ProjectAction.name}] create project [ERR]`, props<{err: Error}>());

	static readonly addAbi = createAction(`[${ProjectAction.name}] add abi [...]`, props<{projectId: string, name?: string, abi: AbiJson}>());
	static readonly addAbiSuccess = createAction(`[${ProjectAction.name}] add abi [OK]`, props<{project: Project}>());
	static readonly addAbiError = createAction(`[${ProjectAction.name}] add abi [ERR]`, props<{err: Error}>());

	static readonly addSmartContract = createAction(`[${ProjectAction.name}] add smart contract [...]`, props<{projectId: string}>());
	static readonly addSmartContractSuccess = createAction(`[${ProjectAction.name}] add smart contract [OK]`, props<{project: Project}>());
	static readonly addSmartContractError = createAction(`[${ProjectAction.name}] add smart contract [ERR]`, props<{err: Error}>());

	static readonly loadAccountAndPositions = createAction(`[${ProjectAction.name}] load account and positions [...]`, props<{projectId: string, address: string}>());
	static readonly loadAccountAndPositionsSuccess = createAction(`[${ProjectAction.name}] load account and positions [OK]`, props<{projectId: string, native: string, account: AccountOnNetwork, tokens: ITokenPosition[]}>());
	static readonly loadAccountAndPositionsError = createAction(`[${ProjectAction.name}] load account and positions [ERR]`, props<{err: Error}>());

	static readonly addWallet = createAction(`[${ProjectAction.name}] add wallet [...]`, props<{projectId: string, wallet: GeneratedWallet}>());
	static readonly addWalletSuccess = createAction(`[${ProjectAction.name}] add wallet [OK]`, props<{project: Project, address: string}>());
	static readonly addWalletError = createAction(`[${ProjectAction.name}] add wallet [ERR]`, props<{err: Error}>());

	static readonly generateWallet = createAction(`[${ProjectAction.name}] generate wallet`, props<{projectId: string}>());

	static readonly uploadAbi = createAction(`[${ProjectAction.name}] upload abi`, props<{projectId: string}>());

	static readonly setScAddress = createAction(`[${ProjectAction.name}] set sc address [...]`, props<{projectId: string, scId: string, address: string}>());
	static readonly setScAddressSuccess = createAction(`[${ProjectAction.name}] set sc address [OK]`, props<{project: Project}>());
	static readonly setScAddressError = createAction(`[${ProjectAction.name}] set sc address [ERR]`, props<{err: Error}>());

	static readonly importToken = createAction(`[${ProjectAction.name}] import token`, props<{projectId: string}>());

	static readonly addToken = createAction(`[${ProjectAction.name}] add token [...]`, props<{projectId: string, identifier: string}>());
	static readonly addTokenSuccess = createAction(`[${ProjectAction.name}] add token [OK]`, props<{projectId: string, identifier: string}>());
	static readonly addTokenError = createAction(`[${ProjectAction.name}] add token [ERR]`, props<{err: Error}>());

	static readonly issueToken = createAction(`[${ProjectAction.name}] issue token [...]`, props<{projectId: string}>());
	static readonly issueTokenSuccess = createAction(`[${ProjectAction.name}] issue token [OK]`, props<{project: Project}>());
	static readonly issueTokenError = createAction(`[${ProjectAction.name}] issue token [ERR]`, props<{err: Error}>());

	static readonly loadProjectTabs = createAction(`[${ProjectAction.name}] load project tabs [...]`);
	static readonly loadProjectTabsSuccess = createAction(`[${ProjectAction.name}] load project tabs [OK]`, props<{tabsData: TabsData}>());
	static readonly loadProjectTabsError = createAction(`[${ProjectAction.name}] load project tabs [ERR]`, props<{err: Error}>());

	static readonly openProjectTab = createAction(
		`[${ProjectAction.name}] open project tab [...]`,
		props<{projectId: string, title: string, componentType: ProjectComponentType, componentId: string}>(),
	);
	static readonly openProjectTabSuccess = createAction(`[${ProjectAction.name}] open project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly openProjectTabError = createAction(`[${ProjectAction.name}] open project tab [ERR]`, props<{err: Error}>());

	static readonly closeProjectTab = createAction(`[${ProjectAction.name}] close project tab [...]`, props<{index: number}>());
	static readonly closeProjectTabSuccess = createAction(`[${ProjectAction.name}] close project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly closeProjectTabError = createAction(`[${ProjectAction.name}] close project tab [ERR]`, props<{err: Error}>());

	static readonly moveProjectTab = createAction(`[${ProjectAction.name}] move project tab [...]`, props<{prevIndex: number, currentIndex: number}>());
	static readonly moveProjectTabSuccess = createAction(`[${ProjectAction.name}] move project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly moveProjectTabError = createAction(`[${ProjectAction.name}] move project tab [ERR]`, props<{err: Error}>());

	static readonly selectTab = createAction(`[${ProjectAction.name}] select tab [...]`, props<{index: number}>());
	static readonly selectTabSuccess = createAction(`[${ProjectAction.name}] select tab [OK]`, props<{tabsData: TabsData}>());
	static readonly selectTabError = createAction(`[${ProjectAction.name}] select tab [ERR]`, props<{err: Error}>());

	static readonly loadAccountTransactions = createAction(`[${ProjectAction.name}] load account transactions [...]`, props<{projectId: string, address: string}>());
	static readonly loadAccountTransactionsSuccess = createAction(`[${ProjectAction.name}] load account transactions [OK]`, props<{projectId: string, address: string, list: IElrondTransaction[]}>());
	static readonly loadAccountTransactionsError = createAction(`[${ProjectAction.name}] load account transactions [ERR]`, props<{err: Error}>());

	static readonly loadToken = createAction(`[${ProjectAction.name}] load token [...]`, props<{projectId: string, identifier: string}>());
	static readonly loadTokenSuccess = createAction(`[${ProjectAction.name}] load token [OK]`, props<{projectId: string, identifier: string, data: ITokenInfo}>());
	static readonly loadTokenError = createAction(`[${ProjectAction.name}] load token [ERR]`, props<{err: Error}>());

	static readonly loadTokenHolders = createAction(`[${ProjectAction.name}] load token holders [...]`, props<{projectId: string, identifier: string}>());
	static readonly loadTokenHoldersSuccess = createAction(`[${ProjectAction.name}] load token holders [OK]`, props<{projectId: string, identifier: string, data: ITokenHolder[]}>());
	static readonly loadTokenHoldersError = createAction(`[${ProjectAction.name}] load token holders [ERR]`, props<{err: Error}>());

	static readonly loadTokenRoles = createAction(`[${ProjectAction.name}] load token roles [...]`, props<{projectId: string, identifier: string}>());
	static readonly loadTokenRolesSuccess = createAction(`[${ProjectAction.name}] load token roles [OK]`, props<{projectId: string, identifier: string, data: ITokenRole[]}>());
	static readonly loadTokenRolesError = createAction(`[${ProjectAction.name}] load token roles [ERR]`, props<{err: Error}>());

	static readonly loadTokenTransfers = createAction(`[${ProjectAction.name}] load token transfers [...]`, props<{projectId: string, identifier: string}>());
	static readonly loadTokenTransfersSuccess = createAction(`[${ProjectAction.name}] load token transfers [OK]`, props<{projectId: string, identifier: string, data: ITokenTransfer[]}>());
	static readonly loadTokenTransfersError = createAction(`[${ProjectAction.name}] load token transfers [ERR]`, props<{err: Error}>());

	static readonly searchTokens = createAction(`[${ProjectAction.name}] search tokens [...]`, props<{projectId: string, options: ITokenSearchOptions}>());
	static readonly searchTokensSuccess = createAction(`[${ProjectAction.name}] search tokens [OK]`, props<{projectId: string, tokens: ITokenInfo[]}>());
	static readonly searchTokensError = createAction(`[${ProjectAction.name}] search tokens [ERR]`, props<{err: Error}>());

	static readonly exportMnemonic = createAction(`[${ProjectAction.name}] export mnemonic`, props<{wallet: GeneratedWallet}>());

	static readonly renameProject = createAction(`[${ProjectAction.name}] rename project [...]`, props<{projectId: string}>());
	static readonly renameProjectSuccess = createAction(`[${ProjectAction.name}] rename project [OK]`, props<{project: Project}>());
	static readonly renameProjectError = createAction(`[${ProjectAction.name}] rename project [ERR]`, props<{err: Error}>());

	static readonly renameAbi = createAction(`[${ProjectAction.name}] rename abi [...]`, props<{projectId: string, abiId: string}>());
	static readonly renameAbiSuccess = createAction(`[${ProjectAction.name}] rename abi [OK]`, props<{project: Project, tabs: OpenedProjectTab[]}>());
	static readonly renameAbiError = createAction(`[${ProjectAction.name}] rename abi [ERR]`, props<{err: Error}>());

	static readonly renameSmartContract = createAction(`[${ProjectAction.name}] rename smart contract [...]`, props<{projectId: string, scId: string}>());
	static readonly renameSmartContractSuccess = createAction(`[${ProjectAction.name}] rename smart contract [OK]`, props<{project: Project, tabs: OpenedProjectTab[]}>());
	static readonly renameSmartContractError = createAction(`[${ProjectAction.name}] rename smart contract [ERR]`, props<{err: Error}>());

	static readonly renameWallet = createAction(`[${ProjectAction.name}] rename wallet [...]`, props<{projectId: string, address: string}>());
	static readonly renameWalletSuccess = createAction(`[${ProjectAction.name}] rename wallet [OK]`, props<{project: Project, tabs: OpenedProjectTab[]}>());
	static readonly renameWalletError = createAction(`[${ProjectAction.name}] rename wallet [ERR]`, props<{err: Error}>());

	static readonly exploreToken = createAction(`[${ProjectAction.name}] explore token`, props<{projectId: string, identifier: string}>());

	static readonly deleteProject = createAction(`[${ProjectAction.name}] delete project [...]`, props<{projectId: string}>());
	static readonly deleteProjectSuccess = createAction(`[${ProjectAction.name}] delete project [OK]`, props<{projectId: string, tabsData: TabsData}>());
	static readonly deleteProjectError = createAction(`[${ProjectAction.name}] delete project [ERR]`, props<{err: Error}>());

	static readonly deleteAbi = createAction(`[${ProjectAction.name}] delete abi [...]`, props<{projectId: string, abiId: string}>());
	static readonly deleteAbiSuccess = createAction(`[${ProjectAction.name}] delete abi [OK]`, props<{project: Project, tabsData: TabsData}>());
	static readonly deleteAbiError = createAction(`[${ProjectAction.name}] delete abi [ERR]`, props<{err: Error}>());

	static readonly deleteSmartContract = createAction(`[${ProjectAction.name}] delete smart contract [...]`, props<{projectId: string, scId: string}>());
	static readonly deleteSmartContractSuccess = createAction(`[${ProjectAction.name}] delete smart contract [OK]`, props<{project: Project, tabsData: TabsData}>());
	static readonly deleteSmartContractError = createAction(`[${ProjectAction.name}] delete smart contract [ERR]`, props<{err: Error}>());

	static readonly deleteToken = createAction(`[${ProjectAction.name}] delete token [...]`, props<{projectId: string, identifier: string}>());
	static readonly deleteTokenSuccess = createAction(`[${ProjectAction.name}] delete token [OK]`, props<{project: Project, tabsData: TabsData}>());
	static readonly deleteTokenError = createAction(`[${ProjectAction.name}] delete token [ERR]`, props<{err: Error}>());

	static readonly deleteWallet = createAction(`[${ProjectAction.name}] delete wallet [...]`, props<{projectId: string, address: string}>());
	static readonly deleteWalletSuccess = createAction(`[${ProjectAction.name}] delete wallet [OK]`, props<{project: Project, tabsData: TabsData}>());
	static readonly deleteWalletError = createAction(`[${ProjectAction.name}] delete wallet [ERR]`, props<{err: Error}>());

	static readonly loadTokenIssueWaitList = createAction(`[${ProjectAction.name}] load token issue wait list [...]`);
	static readonly loadTokenIssueWaitListSuccess = createAction(`[${ProjectAction.name}] load token issue wait list [OK]`, props<{waitList: PendingTokenIssue[]}>());
	static readonly loadTokenIssueWaitListError = createAction(`[${ProjectAction.name}] load token issue wait list [ERR]`, props<{err: Error}>());

	static readonly addTokenIssueTxToWaitList = createAction(`[${ProjectAction.name}] add token issue tx to wait list [...]`, props<{data: PendingTokenIssue}>());
	static readonly addTokenIssueTxToWaitListSuccess = createAction(`[${ProjectAction.name}] add token issue tx to wait list [OK]`, props<{waitList: PendingTokenIssue[]}>());
	static readonly addTokenIssueTxToWaitListError = createAction(`[${ProjectAction.name}] add token issue tx to wait list [ERR]`, props<{err: Error}>());

	static readonly deleteTokenIssueTxFromWaitList = createAction(`[${ProjectAction.name}] delete token issue tx from wait list [...]`, props<{txHash: string}>());
	static readonly deleteTokenIssueTxFromWaitListSuccess = createAction(`[${ProjectAction.name}] delete token issue tx from wait list [OK]`, props<{waitList: PendingTokenIssue[]}>());
	static readonly deleteTokenIssueTxFromWaitListError = createAction(`[${ProjectAction.name}] delete token issue tx from wait list [ERR]`, props<{err: Error}>());

	static readonly addAddress = createAction(`[${ProjectAction.name}] add project address [...]`, props<{projectId: string}>());
	static readonly addAddressSuccess = createAction(`[${ProjectAction.name}] add project address [OK]`, props<{project: Project}>());
	static readonly addAddressError = createAction(`[${ProjectAction.name}] add project address [ERR]`, props<{err: Error}>());

	static readonly renameAddress = createAction(`[${ProjectAction.name}] rename project address [...]`, props<{projectId: string, address: string}>());
	static readonly renameAddressSuccess = createAction(`[${ProjectAction.name}] rename project address [OK]`, props<{project: Project}>());
	static readonly renameAddressError = createAction(`[${ProjectAction.name}] rename project address [ERR]`, props<{err: Error}>());

	static readonly deleteAddress = createAction(`[${ProjectAction.name}] delete project address [...]`, props<{projectId: string, address: string}>());
	static readonly deleteAddressSuccess = createAction(`[${ProjectAction.name}] delete project address [OK]`, props<{project: Project}>());
	static readonly deleteAddressError = createAction(`[${ProjectAction.name}] delete project address [ERR]`, props<{err: Error}>());

	static readonly loadTransaction = createAction(`[${ProjectAction.name}] load transaction [...]`, props<{projectId: string, txHash: string}>());
	static readonly loadTransactionSuccess = createAction(`[${ProjectAction.name}] load transaction [OK]`, props<{projectId: string, tx: IElrondFullTransaction}>());
	static readonly loadTransactionError = createAction(`[${ProjectAction.name}] load transaction [ERR]`, props<{err: Error}>());

	static readonly loadProjectExplorerState = createAction(`[${ProjectAction.name}] load project explorer state [...]`);
	static readonly loadProjectExplorerStateSuccess = createAction(`[${ProjectAction.name}] load project explorer state [OK]`, props<{explorerState: ProjectExplorerState}>());
	static readonly loadProjectExplorerStateError = createAction(`[${ProjectAction.name}] load project explorer state [ERR]`, props<{err: Error}>());

	static readonly syncProjectExplorerTree = createAction(`[${ProjectAction.name}] sync project explorer tree [...]`, props<{projects: Project[]}>());
	static readonly syncProjectExplorerTreeSuccess = createAction(`[${ProjectAction.name}] sync project explorer tree [OK]`, props<{explorerState: ProjectExplorerState}>());
	static readonly syncProjectExplorerTreeError = createAction(`[${ProjectAction.name}] load transaction explorer [ERR]`, props<{err: Error}>());

	static readonly updateProjectExplorerTree = createAction(`[${ProjectAction.name}] update project explorer tree [...]`, props<{nodeId: string, isOpen: boolean, withParents: boolean, withChildren: boolean}>());
	static readonly updateProjectExplorerTreeSuccess = createAction(`[${ProjectAction.name}] update project explorer tree [OK]`, props<{explorerState: ProjectExplorerState}>());
	static readonly updateProjectExplorerTreeError = createAction(`[${ProjectAction.name}] update project explorer tree [ERR]`, props<{err: Error}>());

	static readonly errorActions = [
		ProjectAction.loadProjectsError,
		ProjectAction.updateProjectNetworkError,
		ProjectAction.createProjectError,
		ProjectAction.addAbiError,
		ProjectAction.addSmartContractError,
		ProjectAction.loadAccountAndPositionsError,
		ProjectAction.addWalletError,
		ProjectAction.addTokenError,
		ProjectAction.setScAddressError,
		ProjectAction.issueTokenError,
		ProjectAction.loadProjectTabsError,
		ProjectAction.openProjectTabError,
		ProjectAction.closeProjectTabError,
		ProjectAction.moveProjectTabError,
		ProjectAction.selectTabError,
		ProjectAction.loadAccountTransactionsError,
		ProjectAction.loadTokenError,
		ProjectAction.loadTokenHoldersError,
		ProjectAction.loadTokenRolesError,
		ProjectAction.loadTokenTransfersError,
		ProjectAction.searchTokensError,
		ProjectAction.renameProjectError,
		ProjectAction.renameAbiError,
		ProjectAction.renameSmartContractError,
		ProjectAction.renameWalletError,
		ProjectAction.deleteProjectError,
		ProjectAction.deleteAbiError,
		ProjectAction.deleteSmartContractError,
		ProjectAction.deleteTokenError,
		ProjectAction.deleteWalletError,
		ProjectAction.loadTokenIssueWaitListError,
		ProjectAction.addTokenIssueTxToWaitListError,
		ProjectAction.deleteTokenIssueTxFromWaitListError,
		ProjectAction.addAddressError,
		ProjectAction.renameAddressError,
		ProjectAction.deleteAddressError,
		ProjectAction.loadProjectExplorerStateError,
		ProjectAction.syncProjectExplorerTreeError,
		ProjectAction.updateProjectExplorerTreeError,
	];
}

