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

	static getNativeBalance = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.positionsMap?.[address]?.native || '0',
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

	static smartContractCode = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.accountsMap?.[address]?.code,
	);

	static account = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.accountsMap?.[address],
	);

	static accountTransactions = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.accountTransactionsMap?.[address] || [],
	);

	static accountNativeAmount = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.positionsMap?.[address]?.native || '0',
	);

	static accountTokens = (projectId: string, address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.positionsMap?.[address]?.tokens || [],
	);

	static token = (projectId: string, identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.tokensMap?.[identifier],
	);

	static tokenHolders = (projectId: string, identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.tokenHoldersMap?.[identifier],
	);

	static tokenRoles = (projectId: string, identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.tokenRolesMap?.[identifier],
	);

	static tokenTransfers = (projectId: string, identifier: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.tokenTransfersMap?.[identifier],
	);

	static tokens = (projectId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.tokens || [],
	);

	static issueTokenWaitList = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.issueTokenWaitList || [],
	);

	static projectAddresses = (projectId: string, type?: 'sc' | 'wallet') => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => {
			const list = state.activeProject?.addressBook || [];

			return !type ? list : list.filter(i => i.type === type);
		},
	);

	static tx = (projectId: string, txHash: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.loadedDataMap[projectId]?.transactionsMap?.[txHash],
	);

	static projectExplorerNodeMap = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.explorerNodeMap || [],
	);
}
