import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { TabsData } from '../../core/data-provider/personal-settings.manager';
import { Project } from '../../core/data-provider/data-provider';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface ILoadedProjectDataState {
	transactionsMap: {[address: string]: IElrondTransaction[]};
	accountsMap: {[address: string]: AccountOnNetwork};
	positionsMap: {[address: string]: IPositionsState};
}

export interface IProjectState extends TabsData {
	projects: Project[];
	scCodeMap: {[address: string]: string},
	scAddressesMap: {[scId: string]: {[chainId: string]: string}};
	loadedDataMap: {[projectId: string]: ILoadedProjectDataState}
}

const initialState: IProjectState = {
	projects: [],
	loadedDataMap: {},
	tabs: [],
	scCodeMap: {},
	scAddressesMap: {},
};

export const reducer = createReducer(
	initialState,
	on(ProjectAction.loadProjectsSuccess, (state, { data }) => {
		return {
			...state,
			projects: data,
		}
	}),
	on(ProjectAction.createProjectSuccess, (state, { project }) => ({
		...state,
		projects: [...state.projects, project],
	})),
	on(ProjectAction.addAbiSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.addWalletSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.addTokenSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.loadProjectTabsSuccess,
		ProjectAction.openProjectTabSuccess,
		ProjectAction.closeProjectTabSuccess,
		ProjectAction.moveProjectTabSuccess,
		ProjectAction.selectTabSuccess,
		(state, { tabsData }) => ({
			...state,
			...tabsData,
		})),
	on(ProjectAction.loadScCodeSuccess, (state, { address, code }) => ({
		...state,
		scCodeMap: {
			...state.scCodeMap,
			[address]: code,
		},
	})),
	on(ProjectAction.loadScAddressesSuccess, (state, { map }) => ({
		...state,
		scAddressesMap: {
			...state.scAddressesMap,
			...map,
		},
	})),
	on(ProjectAction.setScAddressSuccess, (state, { scId, subMap }) => ({
		...state,
		scAddressesMap: {
			...state.scAddressesMap,
			[scId]: {
				...state.scAddressesMap[scId],
				...subMap,
			},
		},
	})),
	on(ProjectAction.loadAccountAndPositionsSuccess, (state, { projectId, native, account, tokens }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				positionsMap: {
					...state.loadedDataMap[projectId]?.positionsMap,
					[account.address.bech32()]: {
						native,
						tokens,
					},
				},
				accountsMap: {
					...state.loadedDataMap[projectId]?.accountsMap,
					[account.address.bech32()]: account,
				},
			},
		},
	})),
	on(ProjectAction.loadAccountTransactionsSuccess, (state, { projectId, address, list }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				transactionsMap: {
					...state.loadedDataMap[projectId]?.transactionsMap,
					[address]: list,
				},
			},
		},
	})),
);

export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
