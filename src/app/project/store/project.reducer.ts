import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ProjectsInfo } from '../../core/data-provider/data-provider';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { OpenedProjectTab } from '../../core/data-provider/personal-settings.manager';

export interface IPositionsState {
	native: string;
	tokens: ITokenPosition[];
}

export interface IProjectState extends ProjectsInfo {
	positionsMap: {[address: string]: IPositionsState};
	tabs: OpenedProjectTab[];
}

const initialState: IProjectState = {
	projects: [],
	positionsMap: {},
	tabs: [],
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
	on(ProjectAction.selectScSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
		selected: state.selected?.id === project.id ? project : state.selected,
	})),
	on(ProjectAction.addTokenSuccess, (state, { project }) => ({
		...state,
		projects: state.projects.map(p => p.id === project.id ? project : p),
		selected: state.selected?.id === project.id ? project : state.selected,
	})),
	on(ProjectAction.loadProjectTabsSuccess,
		ProjectAction.openProjectTabSuccess,
		ProjectAction.closeProjectTabSuccess,
		ProjectAction.moveProjectTabSuccess,
		(state, { tabs }) => ({
			...state,
			tabs,
		})),
);


export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
