import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ProjectsInfo } from '../../core/data-provider/data-provider';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface IProjectState extends ProjectsInfo {
	positionsMap: {[address: string]: IPositionsState};
}

const initialState: IProjectState = {
	projects: [],
	positionsMap: {},
};

export const reducer = createReducer(
	initialState,
	on(ProjectAction.loadProjectsSuccess, (state, { data }) => {
		return {
			...state,
			...data,
		}
	}),
	on(ProjectAction.selectProjectSuccess, (state, { project }) => ({
		...state,
		selected: project,
		positionsMap: {},
	})),
	on(ProjectAction.createProjectSuccess, (state, { project }) => ({
		...state,
		projects: [...state.projects, project],
		selected: state.selected ? state.selected : project,
	})),
	on(ProjectAction.addAbiSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
		selected: state.selected?.id === project.id ? project : state.selected,
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
		selected: state.selected?.id === project.id ? project : state.selected,
	})),
	on(ProjectAction.setScAddressSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
		selected: state.selected?.id === project.id ? project : state.selected,
	})),
);


export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
