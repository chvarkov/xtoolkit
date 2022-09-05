import { DataProvider, GeneratedWallet, Project, ProjectScAbi, ProjectsInfo } from '../data-provider';
import { Observable, of } from 'rxjs';
import { DEFAULT_NETWORKS } from '../../constants';
import { Injectable } from '@angular/core';
import { NetworkInfo } from '../data-provider';
import { INetworkEnvironment } from '../../interfaces/network-environment';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';
import { IScAbi } from '../../interfaces/sc-abi';

@Injectable({providedIn: 'root'})
export class LocalstorageDataProvider implements DataProvider {
	private readonly globalPrefix = 'elrond-sc';
	private readonly networksKey = `${this.globalPrefix}.networks`;
	private readonly projectsKey = `${this.globalPrefix}.projects`;

	getNetworks(): Observable<NetworkInfo> {
		const networks: NetworkInfo | null = this.get(this.networksKey);

		if (!networks) {
			const defaultNetworkInfo: NetworkInfo = {
				list: DEFAULT_NETWORKS,
				selected: DEFAULT_NETWORKS[0],
			};

			this.set(this.networksKey, defaultNetworkInfo);

			return of(defaultNetworkInfo);
		}

		return of(networks);
	}

	selectNetwork(network: INetworkEnvironment): Observable<void> {
		return this.getNetworks()
			.pipe(
				map((info => {
					info.selected = network;
					this.set(this.networksKey, info);
				})),
			);
	}

	getProjects(): Observable<ProjectsInfo> {
		const projects: ProjectsInfo | null = this.get(this.projectsKey);

		if (!projects) {
			const defaultProjectInfo: ProjectsInfo = {
				projects: [],
			};

			this.set(this.projectsKey, defaultProjectInfo);

			return of(defaultProjectInfo);
		}

		return of(projects);
	}

	createProject(name: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const project: Project = {
						id: uuid.v4(),
						name,
						smartContracts: [],
						wallets: [],
					};

					if (!info.selected) {
						info.selected = project;
					}

					info.projects.push(project);

					this.set(this.projectsKey, info);

					return project;
				})),
			);
	}

	addAbi(projectId: string, abi: IScAbi, name: string = abi.name): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const sc: ProjectScAbi = {
						id: uuid.v4(),
						name,
						abi,
					};

					const project = info.projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.smartContracts.push(sc);

					if (!project.selectedScId) {
						project.selectedScId = sc.id;
					}

					if (info.selected?.id === project.id) {
						info.selected = project;
					}

					this.set(this.projectsKey, info);

					return project;
				})),
			);
	}

	setScAddress(projectId: string, scId: string, address: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const project = info.projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Smart contract not found');
					}

					sc.address = address;

					if (info.selected?.id === project.id) {
						info.selected = project;
					}

					this.set(this.projectsKey, info);

					return project;
				})),
			);
	}

	selectSc(projectId: string, scId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const project = info.projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Smart contract not found');
					}

					project.selectedScId = scId;

					if (info.selected?.id === project.id) {
						info.selected = project;
					}

					this.set(this.projectsKey, info);

					return project;
				})),
			);
	}

	addWallet(projectId: string, wallet: GeneratedWallet): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const project = info.projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.wallets.push(wallet);

					this.set(this.projectsKey, info);

					return project;
				})),
			);
	}

	selectProject(projectId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((info => {
					const selectedProject = info.projects.find(i => i.id === projectId);

					if (!selectedProject) {
						throw new Error('Project not found');
					}

					info.selected = selectedProject;
					this.set(this.projectsKey, info);

					return selectedProject;
				})),
			);
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
