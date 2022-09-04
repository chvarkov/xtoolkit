import { createAction, props } from '@ngrx/store';
import { Project, ProjectsInfo } from '../../core/data-provider/data-provider';
import { IScAbi } from '../../core/interfaces/sc-abi';

export class ProjectAction {
	static readonly loadProjects = createAction(`[${ProjectAction.name}] load projects [...]`);
	static readonly loadProjectsSuccess = createAction(`[${ProjectAction.name}] load projects [OK]`, props<{data: ProjectsInfo}>());
	static readonly loadProjectsError = createAction(`[${ProjectAction.name}] load projects [ERR]`, props<{err: Error}>());

	static readonly selectProject = createAction(`[${ProjectAction.name}] select project [...]`, props<{projectId: string}>());
	static readonly selectProjectSuccess = createAction(`[${ProjectAction.name}] select project [OK]`, props<{project: Project}>());
	static readonly selectProjectError = createAction(`[${ProjectAction.name}] select project [ERR]`, props<{err: Error}>());

	static readonly createProject = createAction(`[${ProjectAction.name}] create project [...]`);
	static readonly createProjectSuccess = createAction(`[${ProjectAction.name}] create project [OK]`, props<{project: Project}>());
	static readonly createProjectError = createAction(`[${ProjectAction.name}] create project [ERR]`, props<{err: Error}>());

	static readonly addAbi = createAction(`[${ProjectAction.name}] add abi [...]`, props<{projectId: string, name?: string, abi: IScAbi}>());
	static readonly addAbiSuccess = createAction(`[${ProjectAction.name}] add abi [OK]`, props<{project: Project}>());
	static readonly addAbiError = createAction(`[${ProjectAction.name}] add abi [ERR]`, props<{err: Error}>());
}

