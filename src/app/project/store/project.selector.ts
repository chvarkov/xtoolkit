import { createSelector } from '@ngrx/store';
import { PROJECT_FEATURE } from '../constants';
import { IProjectState } from './project.reducer';

export class ProjectSelector {
	static projectList = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projectList,
	);

	static activeProject = () => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.activeProject,
	);

	static smartContracts = () => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.activeProject?.smartContracts || [],
	);

	static smartContractsById = (scId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => (state.activeProject?.smartContracts || []).find(sc => sc.id === scId),
	);

	static abiById = (abiId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => (state.activeProject?.abiInterfaces || []).find(abi => abi.id === abiId),
	);

	static wallets = () => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.activeProject?.wallets || [],
	);

	static getNativeBalance = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.positionsMap?.[address]?.native || '0',
	);

	static openedTabs = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.tabs || [],
	);

	static activeTab = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.selectedIndex != null && state.tabs
			? state.tabs?.[state.selectedIndex]
			: undefined,
	);

	static currentTabIndex = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.selectedIndex,
	);

	static smartContractCode = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.accountsMap?.[address]?.code,
	);

	static account = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.accountsMap?.[address],
	);

	static accountTransactions = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.accountTransactionsMap?.[address] || [],
	);

	static accountNativeAmount = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.positionsMap?.[address]?.native || '0',
	);

	static accountTokens = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.positionsMap?.[address]?.tokens || [],
	);

	static token = (identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.tokensMap?.[identifier],
	);

	static tokenHolders = (identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.tokenHoldersMap?.[identifier],
	);

	static tokenRoles = (identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.tokenRolesMap?.[identifier],
	);

	static tokenTransfers = (identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.tokenTransfersMap?.[identifier],
	);

	static tokens = () => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.tokens || [],
	);

	static issueTokenWaitList = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.issueTokenWaitList || [],
	);

	static projectAddresses = (type?: 'sc' | 'wallet') => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => {
			const list = state.activeProject?.addressBook || [];

			return !type ? list : list.filter(i => i.type === type);
		},
	);

	static tx = (txHash: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap.transactionsMap?.[txHash],
	);

	static projectExplorerNodeMap = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.explorerNodeMap || [],
	);
}
