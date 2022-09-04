import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../interfaces/network-environment';
import { IScAbi } from '../interfaces/sc-abi';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export interface NetworkInfo {
	list: INetworkEnvironment[];
	selected: INetworkEnvironment;
}

export interface ProjectScAbi {
	name?: string;
	abi: IScAbi;
}

export interface Project {
	id: string;
	name: string;
	smartContracts: ProjectScAbi[];
}

export interface ProjectsInfo {
	projects: Project[];
	selected?: Project;
}

export interface DataProvider {
	getNetworks(): Observable<NetworkInfo>;

	selectNetwork(network: INetworkEnvironment): Observable<void>

	getProjects(): Observable<ProjectsInfo>;

	createProject(name: string): Observable<Project>;

	addAbi(projectId: string, abi: IScAbi, name?: string): Observable<Project>;

	selectProject(projectId: string): Observable<Project>;
}
