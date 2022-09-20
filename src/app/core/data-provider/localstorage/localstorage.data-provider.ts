import { ActionHistoryElement, DataProvider, GeneratedWallet, Project, ProjectScAbi } from '../data-provider';
import { Observable, of } from 'rxjs';
import { DEFAULT_NETWORKS } from '../../constants';
import { Injectable } from '@angular/core';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AbiJson } from '../../elrond/builders/sc.builder';

@Injectable({providedIn: 'root'})
export class LocalstorageDataProvider implements DataProvider {
	private readonly globalPrefix = 'elrond-sc';
	private readonly networksKey = `${this.globalPrefix}.networks`;
	private readonly projectsKey = `${this.globalPrefix}.projects`;
	private readonly actionHistoryKey = `${this.globalPrefix}.action-history`;

	getNetworks(): Observable<INetworkEnvironment[]> {
		const networks: INetworkEnvironment[] | null = this.get(this.networksKey);

		if (!networks) {
			const defaultNetworks: INetworkEnvironment[] = DEFAULT_NETWORKS;

			this.set(this.networksKey, defaultNetworks);

			return of(defaultNetworks);
		}

		return of(networks);
	}

	getProjects(): Observable<Project[]> {
		const projects: Project[] | undefined = this.get(this.projectsKey);

		if (!projects) {
			this.set(this.projectsKey, []);

			return of([]);
		}

		return of(projects);
	}

	createProject(name: string, chainId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project: Project = {
						id: uuid.v4(),
						name,
						chainId,
						smartContracts: [],
						wallets: [],
						tokens: [],
					};

					projects.push(project);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	addAbi(projectId: string, abi: AbiJson, name: string = abi.name): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const sc: ProjectScAbi = {
						id: uuid.v4(),
						name,
						abi,
						projectId,
						address: '',
					};

					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.smartContracts.push(sc);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	setScAddress(projectId: string, scId: string, address: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Sc not found');
					}

					sc.address = address;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	addToken(projectId: string, tokenAddress: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const duplicate = project.tokens.find(id => id === tokenAddress);

					if (duplicate) {
						throw new Error('Token already exists in this project');
					}

					project.tokens.push(tokenAddress);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	addWallet(projectId: string, wallet: GeneratedWallet): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.wallets.push(wallet);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	logAction(action: ActionHistoryElement): Observable<ActionHistoryElement[]> {
		return this.getActionHistory()
			.pipe(
				map(list => {
					list = [
						action,
						...list,
					];

					this.set(this.actionHistoryKey, list);

					return list;
				}),
			);
	}

	getActionHistory(): Observable<ActionHistoryElement[]> {
		const projects: ActionHistoryElement[] | undefined = this.get(this.actionHistoryKey);

		if (!projects) {
			this.set(this.actionHistoryKey, []);

			return of([]);
		}

		return of(projects);
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
