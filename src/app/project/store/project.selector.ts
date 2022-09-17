import { createSelector } from '@ngrx/store';
import { PROJECT_FEATURE } from '../constants';
import { IProjectState } from './project.reducer';
import { Project } from '../../core/data-provider/data-provider';

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

	static walletsByProjectId = (projectId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.projects.find(p => p.id === projectId)?.wallets || [],
	);

	static getNativeBalance = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.positionsMap[address]?.native || '0',
	);

	static getTokenBalances = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.positionsMap[address]?.tokens || [],
	);

	static getAddressesWithLoadedBalances = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => Object.keys(state?.positionsMap || {}),
	);

	static openedTabs = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.tabs || [],
	);

	static currentTabIndex = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.selectedIndex,
	);

	static getScCode = (address: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.scCodeMap[address] || '',
	);

	static addressesMapByScId = (scId: string) => createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => scId && state.scAddressesMap[scId] || {},
	);
}
