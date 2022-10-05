import { createSelector } from '@ngrx/store';
import { PROJECT_FEATURE } from '../constants';
import { IProjectState } from './project.reducer';
import { Project, ProjectAddress } from '../../core/data-provider/data-provider';

export class ProjectSelector {
	static projects = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projects,
	);

	static networkById = (id: string) => createSelector(
		(state: Record<string, any>) => ProjectSelector.projects(state),
		(state: Project[]) => (state || []).find(i => i.id === id),
	);

	static projectById = (projectId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projects.find(p => p.id === projectId),
	);

	static smartContractsByProjectId = (projectId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projects.find(p => p.id === projectId)?.smartContracts || [],
	);

	static smartContractsById = (projectId: string, scId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => (state.projects.find(p => p.id === projectId)?.smartContracts || [])
			.find(sc => sc.id === scId),
	);

	static abiById = (projectId: string, abiId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => (state.projects.find(p => p.id === projectId)?.abiInterfaces || [])
			.find(abi => abi.id === abiId),
	);

	static walletsByProjectId = (projectId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projects.find(p => p.id === projectId)?.wallets || [],
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
			const list = state.projects.find(p => p.id === projectId)?.addressBook || [];

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
