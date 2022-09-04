import { Action, createReducer, on } from '@ngrx/store';
import { ProjectAction } from './project.action';
import { ProjectsInfo } from '../../core/data-provider/data-provider';

export interface IProjectState extends ProjectsInfo {
}

const initialState: IProjectState = {
	projects: [],
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
);


export function projectReducer(state: IProjectState | undefined, action: Action): IProjectState {
	return reducer(state, action);
}
