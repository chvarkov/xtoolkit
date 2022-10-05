import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { ProjectExplorerState, TabsData } from '../../core/data-provider/personal-settings.manager';
import { PendingTokenIssue, Project } from '../../core/data-provider/data-provider';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { IElrondFullTransaction, IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';
import { ITokenInfo } from '../../core/elrond/interfaces/token-info';
import { ITokenHolder } from '../../core/elrond/interfaces/token-holder';
import { ITokenRole } from '../../core/elrond/interfaces/token-role';
import { ITokenTransfer } from '../../core/elrond/interfaces/token-transfer';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface ILoadedProjectDataState {
	transactionsMap: {[txHash: string]: IElrondFullTransaction};
	accountTransactionsMap: {[address: string]: IElrondTransaction[]};
	accountsMap: {[address: string]: AccountOnNetwork};
	positionsMap: {[address: string]: IPositionsState};
	tokensMap: {[identifier: string]: ITokenInfo};
	tokenHoldersMap: {[identifier: string]: ITokenHolder[]};
	tokenRolesMap: {[identifier: string]: ITokenRole[]};
	tokenTransfersMap: {[identifier: string]: ITokenTransfer[]};
	tokens: ITokenInfo[];
}

export interface IProjectState extends TabsData, ProjectExplorerState {
	projects: Project[];
	loadedDataMap: {[projectId: string]: ILoadedProjectDataState}
	issueTokenWaitList: PendingTokenIssue[];
}

const initialState: IProjectState = {
	projects: [],
	loadedDataMap: {},
	tabs: [],
	issueTokenWaitList: [],
	explorerNodeMap: {},
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
	on(ProjectAction.addTokenSuccess, (state, { projectId, identifier }) => ({
		...state,
		projects: state.projects.map(p => p.id !== projectId ? p : {...p, tokens: [...p.tokens, identifier]}),
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
				accountTransactionsMap: {
					...state.loadedDataMap[projectId]?.accountTransactionsMap,
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
	on(ProjectAction.renameProjectSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.renameSmartContractSuccess, (state, { project, tabs }) => ({
		...state,
		tabs,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.renameWalletSuccess, (state, { project, tabs}) => ({
		...state,
		tabs,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.deleteProjectSuccess, (state, { projectId, tabsData }) => ({
		...state,
		...tabsData,
		projects: state.projects.filter(p => p.id !== projectId),
	})),
	on(ProjectAction.deleteSmartContractSuccess, (state, { project, tabsData }) => ({
		...state,
		...tabsData,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.deleteTokenSuccess, (state, { project, tabsData }) => ({
		...state,
		...tabsData,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.deleteWalletSuccess, (state, { project, tabsData }) => ({
		...state,
		...tabsData,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.loadTokenIssueWaitListSuccess, (state, {waitList}) => ({
		...state,
		issueTokenWaitList: waitList,
	})),
	on(ProjectAction.addTokenIssueTxToWaitListSuccess, (state, {waitList}) => ({
		...state,
		issueTokenWaitList: waitList,
	})),
	on(ProjectAction.deleteTokenIssueTxFromWaitListSuccess, (state, {waitList}) => ({
		...state,
		issueTokenWaitList: waitList,
	})),
	on(ProjectAction.updateProjectNetworkSuccess, (state, {project}) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.addSmartContractSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.deleteAbiSuccess, (state, { project, tabsData }) => ({
		...state,
		...tabsData,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.renameAbiSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.addAddressSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.renameAddressSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.deleteAddressSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
	})),
	on(ProjectAction.loadTransactionSuccess, (state, { projectId, tx }) => ({
		...state,
		loadedDataMap: {
			...state.loadedDataMap,
			[projectId]: {
				...state.loadedDataMap[projectId],
				transactionsMap: {
					...state.loadedDataMap[projectId]?.transactionsMap,
					[tx.txHash]: tx,
				},
			},
		},
	})),
	on(ProjectAction.loadProjectExplorerStateSuccess, (state, {explorerState}) => ({
		...state,
		...explorerState,
	})),
	on(ProjectAction.syncProjectExplorerTreeSuccess, (state, {explorerState}) => ({
		...state,
		...explorerState,
	})),
	on(ProjectAction.updateProjectExplorerTreeSuccess, (state, {explorerState}) => ({
		...state,
		...explorerState,
	})),


	...ProjectAction.errorActions.map((action): ReducerTypes<IProjectState, any> => on(action, (state, { err, type }): IProjectState => {
		console.error(`Action: ${type}`, err);

		return state as any;
	}))
);

export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
