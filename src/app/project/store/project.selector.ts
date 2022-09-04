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

	static selectedProject = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.selected,
	);

	static smartContractsOfSelectedProject = createSelector(
		(app: Record<string, any>) => app[PROJECT_FEATURE],
		(state: IProjectState) => state.selected?.smartContracts || [],
	);
}
