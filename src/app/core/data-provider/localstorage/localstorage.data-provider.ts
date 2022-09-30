import {
	ActionHistoryElement,
	ActionStatus,
	DataProvider,
	GeneratedWallet, PendingTokenIssue,
	Project, ProjectAbi, ProjectAddress,
	ProjectSmartContract
} from '../data-provider';
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
	private readonly tokenIssueWaitListKey = `${this.globalPrefix}.token-issue-wait-list`;

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

	updateProjectNetwork(projectId: string, chainId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.chainId = chainId;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	deleteProject(projectId: string): Observable<void> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					projects = projects.filter(p => p.id !== projectId);

					this.set(this.projectsKey, projects);
				})),
			);
	}

	renameProject(projectId: string, name: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.name = name;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	createProject(name: string, chainId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project: Project = {
						id: uuid.v4(),
						name,
						chainId,
						abiInterfaces: [],
						smartContracts: [],
						wallets: [],
						tokens: [],
						addressBook: [],
					};

					projects.push(project);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	addAbi(projectId: string, content: AbiJson, name: string = content.name): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const abi: ProjectAbi = {
						id: uuid.v4(),
						projectId,
						name,
						content,
					};

					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.abiInterfaces.push(abi);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	renameAbi(projectId: string, abiId: string, name: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const abi = project.abiInterfaces.find(sc => sc.id === abiId);

					if (!abi) {
						throw new Error('Abi interface not found');
					}

					abi.name = name;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	deleteAbi(projectId: string, abiId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.abiInterfaces = project.abiInterfaces.filter(abi => abi.id !== abiId);
					project.smartContracts = project.smartContracts.filter(sc => sc.abiId !== abiId);

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	createSmartContract(projectId: string, abiId: string, name: string, address: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const sc: ProjectSmartContract = {
						id: uuid.v4(),
						name,
						abiId,
						projectId,
						address,
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

	renameSmartContract(projectId: string, scId: string, name: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Smart contract not found');
					}

					sc.name = name;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	deleteSmartContract(projectId: string, scId: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.smartContracts = project.smartContracts.filter(sc => sc.id !== scId);

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

	deleteToken(projectId: string, identifier: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.tokens = project.tokens.filter(token => token !== identifier);

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

	renameWallet(projectId: string, address: string, name: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(p => p.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					const wallet = project.wallets.find(w => w.address === address);

					if (!wallet) {
						throw new Error('Wallet not found');
					}

					wallet.name = name;

					this.set(this.projectsKey, projects);

					return project;
				})),
			);
	}

	deleteWallet(projectId: string, address: string): Observable<Project> {
		return this.getProjects()
			.pipe(
				map((projects => {
					const project = projects.find(i => i.id === projectId);

					if (!project) {
						throw new Error('Project not found');
					}

					project.wallets = project.wallets.filter(w => w.address !== address);

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
		const history: ActionHistoryElement[] | undefined = this.get(this.actionHistoryKey);

		if (!history) {
			this.set(this.actionHistoryKey, []);

			return of([]);
		}

		return of(history);
	}

	clearActionHistory(): Observable<void> {
		this.set(this.actionHistoryKey, []);

		return of();
	}

	updateActionStatus(id: string, status: ActionStatus): Observable<ActionHistoryElement[]> {
		return this.getActionHistory()
			.pipe(
				map(list => {
					const item = list.find(i => i.id === id);

					if (!item) {
						throw new Error(`Action history element (${id}) not found`);
					}

					item.status = status;

					this.set(this.actionHistoryKey, list);

					return list;
				}),
			);
	}

	getTokenIssueWaitList(): Observable<PendingTokenIssue[]> {
		const waitList: PendingTokenIssue[] | undefined = this.get(this.tokenIssueWaitListKey);

		if (!waitList) {
			this.set(this.tokenIssueWaitListKey, []);

			return of([]);
		}

		return of(waitList);
	}

	addTokenIssueTransaction(data: PendingTokenIssue): Observable<PendingTokenIssue[]> {
		return this.getTokenIssueWaitList()
			.pipe(
				map(waitList => {
					const isAlreadyExists = !!waitList.find(item => item.txHash === data.txHash);

					if (isAlreadyExists) {
						return waitList;
					}

					waitList.push(data);

					this.set(this.tokenIssueWaitListKey, waitList);

					return waitList;
				}),
			);
	}

	deleteTokenIssueTransaction(txHash: string): Observable<PendingTokenIssue[]> {
		return this.getTokenIssueWaitList()
			.pipe(
				map(waitList => {
					waitList = waitList.filter(item => item.txHash !== txHash);

					this.set(this.tokenIssueWaitListKey, waitList);

					return waitList;
				}),
			);
	}

	addProjectAddress(data: ProjectAddress): Observable<Project> {
		return this.getProjects().pipe(
			map(projects => {
				const project = projects.find(p => p.id === data.projectId);

				if (!project) {
					throw new Error('Project not found');
				}

				const existingAddress = project.addressBook.find(a => a.address === data.address);

				if (existingAddress) {
					throw new Error('Address already exists');
				}

				project.addressBook.push(data);

				this.set(this.projectsKey, projects);

				return project;
			}),
		);
	}

	deleteProjectAddress(projectId: string, address: string): Observable<Project> {
		return this.getProjects().pipe(
			map(projects => {
				const project = projects.find(p => p.id === projectId);

				if (!project) {
					throw new Error('Project not found');
				}

				project.addressBook = project.addressBook.filter(a => a.address !== address);

				this.set(this.projectsKey, projects);

				return project;
			}),
		);
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
