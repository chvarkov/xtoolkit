import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { TabsData } from '../../core/data-provider/personal-settings.manager';
import { Project } from '../../core/data-provider/data-provider';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface IProjectState extends TabsData {
	projects: Project[];
	positionsMap: {[address: string]: IPositionsState};
	scCodeMap: {[address: string]: string},
	scAddressesMap: {[scId: string]: {[chainId: string]: string}};
}

const initialState: IProjectState = {
	projects: [],
	positionsMap: {},
	tabs: [],
	scCodeMap: {},
	scAddressesMap: {},
};

export const reducer = createReducer(
	initialState,
	on(ProjectAction.loadProjectsSuccess, (state, { data }) => {
		return {
			...state,
			...data,
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
	on(ProjectAction.loadPositionsSuccess, (state, { address, native, tokens }) => ({
		...state,
		positionsMap: {
			...state.positionsMap,
			[address]: {native, tokens},
		},
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
);

export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
