import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { TabsData } from '../../core/data-provider/personal-settings.manager';
import { Project } from '../../core/data-provider/data-provider';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';
import { ITokenInfo } from '../../core/elrond/interfaces/token-info';
import { ITokenHolder } from '../../core/elrond/interfaces/token-holder';
import { ITokenRole } from '../../core/elrond/interfaces/token-role';
import { ITokenTransfer } from '../../core/elrond/interfaces/token-transfer';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface ILoadedProjectDataState {
	transactionsMap: {[address: string]: IElrondTransaction[]};
	accountsMap: {[address: string]: AccountOnNetwork};
	positionsMap: {[address: string]: IPositionsState};
	tokensMap: {[identifier: string]: ITokenInfo};
	tokenHoldersMap: {[identifier: string]: ITokenHolder[]};
	tokenRolesMap: {[identifier: string]: ITokenRole[]};
	tokenTransfersMap: {[identifier: string]: ITokenTransfer[]};
	tokens: ITokenInfo[];
}

export interface IProjectState extends TabsData {
	projects: Project[];
	loadedDataMap: {[projectId: string]: ILoadedProjectDataState}
}

const initialState: IProjectState = {
	projects: [],
	loadedDataMap: {},
	tabs: [],
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
	on(ProjectAction.setScAddressSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
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

	on(ProjectAction.loadTokenSuccess, (state, { projectId, identifier, data }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				tokensMap: {
					...state.loadedDataMap[projectId]?.tokensMap,
					[identifier]: data,
				},
			},
		},
	})),

	on(ProjectAction.loadTokenHoldersSuccess, (state, { projectId, identifier, data }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				tokenHoldersMap: {
					...state.loadedDataMap[projectId]?.tokenHoldersMap,
					[identifier]: data,
				},
			},
		},
	})),

	on(ProjectAction.loadTokenRolesSuccess, (state, { projectId, identifier, data }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				tokenRolesMap: {
					...state.loadedDataMap[projectId]?.tokenRolesMap,
					[identifier]: data,
				},
			},
		},
	})),

	on(ProjectAction.loadTokenTransfersSuccess, (state, { projectId, identifier, data }) => ({
		...state,
		loadedDataMap: {
			[projectId]: {
				...state.loadedDataMap[projectId],
				tokenTransfersMap: {
					...state.loadedDataMap[projectId]?.tokenTransfersMap,
					[identifier]: data,
				},
			},
		},
	})),
	on(ProjectAction.searchTokensSuccess, (state, { projectId, tokens }) => ({
		...state,
		loadedDataMap: {
			...state.loadedDataMap,
			[projectId]: {
				...state.loadedDataMap[projectId],
				tokens,
			},
		},
	})),
);

export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
