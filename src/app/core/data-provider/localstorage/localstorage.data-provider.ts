import { DataProvider, GeneratedWallet, Project, ProjectScAbi } from '../data-provider';
import { Observable, of } from 'rxjs';
import { DEFAULT_NETWORKS } from '../../constants';
import { Injectable } from '@angular/core';
import { NetworkInfo } from '../data-provider';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AbiJson } from '../../elrond/builders/sc.builder';

@Injectable({providedIn: 'root'})
export class LocalstorageDataProvider implements DataProvider {
	private readonly globalPrefix = 'elrond-sc';
	private readonly networksKey = `${this.globalPrefix}.networks`;
	private readonly projectsKey = `${this.globalPrefix}.projects`;
	private readonly addressesKey = `${this.globalPrefix}.addresses`;

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
					};

					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.smartContracts.push(sc);

					if (!project.selectedScId) {
						project.selectedScId = sc.id;
					}

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	getAllScAddresses(): Observable<{[scId: string]: {[chainId: string]: string}}> {
		const scAddressesMap: { [p: string]: { [p: string]: string } } | undefined = this.get(this.addressesKey);

		if (!scAddressesMap) {
			this.set(this.addressesKey, {});

			return of({});
		}

		return of(scAddressesMap);
	}

	setScAddress(scId: string, chainId: string, address: string): Observable<{[chainId: string]: string}> {
		return this.getAllScAddresses()
			.pipe(
				map((map => {
					if (!map[scId]) {
						map[scId] = {};
					}

					map[scId][chainId] = address;

					this.set(this.addressesKey, map);

					return map[scId];
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

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
