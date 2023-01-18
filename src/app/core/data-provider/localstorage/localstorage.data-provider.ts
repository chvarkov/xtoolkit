import {
	ActionHistoryElement,
	ActionStatus,
	DataProvider,
	ProjectWallet, PendingTokenIssue,
	Project, ProjectAbi, ProjectAddress, ProjectInfo,
	ProjectSmartContract, UpdateActionHistoryElementOptions
} from '../data-provider';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { DEFAULT_NETWORKS } from '../../constants';
import { Injectable } from '@angular/core';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { map, switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AbiJson } from '../../elrond/builders/sc.builder';
import { SELF_PROJECT_ID } from '../personal-settings.manager';
import { GLOBAL_PREFIX } from './constants';

@Injectable({providedIn: 'root'})
export class LocalstorageDataProvider implements DataProvider {
	private readonly networksKey = `${GLOBAL_PREFIX}.networks`;
	private readonly activeProjectKey = `${GLOBAL_PREFIX}.active-project`;
	private readonly projectsKey = `${GLOBAL_PREFIX}.projects`;
	private readonly projectListKey = `${GLOBAL_PREFIX}.project-list`;
	private readonly projectKey = `${GLOBAL_PREFIX}.project`;
	private readonly actionHistoryKey = `${GLOBAL_PREFIX}.action-history`;
	private readonly tokenIssueWaitListKey = `${GLOBAL_PREFIX}.token-issue-wait-list`;

	getNetworks(): Observable<INetworkEnvironment[]> {
		const networks: INetworkEnvironment[] | null = this.get(this.networksKey);

		if (!networks) {
			const defaultNetworks: INetworkEnvironment[] = DEFAULT_NETWORKS;

			this.set(this.networksKey, defaultNetworks);

			return of(defaultNetworks);
		}

		return of(networks);
	}

	addNetwork(network: INetworkEnvironment): Observable<INetworkEnvironment[]> {
		return this.getNetworks()
			.pipe(
				map((networks => {
					if (networks.find(n => n.chainId === network.chainId)) {
						throw new Error(`Network with chainId="${network.chainId}" already exists`);
					}

					networks.push(network);

					this.set(this.networksKey, networks);

					return networks;
				})),
			);
	}

	updateNetwork(chainId: string, network: INetworkEnvironment): Observable<INetworkEnvironment[]> {
		return this.getNetworks()
			.pipe(
				map((networks => {
					if (DEFAULT_NETWORKS.find(n => n.chainId === chainId)) {
						throw new Error(`Cannot delete default network`);
					}

					networks = networks.map(n => n.chainId !== chainId ? n : network);

					this.set(this.networksKey, networks);

					return networks;
				})),
			);
	}

	deleteNetwork(chainId: string): Observable<INetworkEnvironment[]> {
		return this.getNetworks()
			.pipe(
				map((networks => {
					if (DEFAULT_NETWORKS.find(n => n.chainId === chainId)) {
						throw new Error(`Cannot delete default network`);
					}

					networks = networks.filter(n => n.chainId !== chainId);

					this.set(this.networksKey, networks);

					return networks;
				})),
			);
	}

	getActiveProjectId(): Observable<string> {
		return of(this.get(this.activeProjectKey) || SELF_PROJECT_ID);
	}

	closeProject(): Observable<void> {
		return of(null).pipe(
			map(() => this.set(this.activeProjectKey, SELF_PROJECT_ID)),
		);
	}

	openProject(projectId: string): Observable<Project> {
		return this.getProject(projectId).pipe(
			map(project => {
				if (!project) {
					throw new Error('Project not found');
				}

				this.set(this.activeProjectKey, project.id);

				return project;
			}),
		);
	}

	getActiveProject(): Observable<Project | undefined> {
		const activeProjectId: string | undefined = this.get(this.activeProjectKey);

		if (!activeProjectId || activeProjectId === SELF_PROJECT_ID) {
			return of(undefined);
		}

		return this.getProject(activeProjectId);
	}

	getProject(id: string): Observable<Project> {
		const key = `${this.projectKey}.${id}`;

		const project: Project | undefined = this.get(key);

		if (!project) {
			return throwError(new Error(`Project "${id}" not found.`));
		}

		return of(project);
	}

	getProjectList(): Observable<ProjectInfo[]> {
		const list: ProjectInfo[] | undefined = this.get(this.projectListKey);

		if (!list) {
			this.set(this.projectListKey, []);

			return of([]);
		}

		return of(list);
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
		return this.getProject(projectId)
			.pipe(
				map((project => {
					project.chainId = chainId;

					this.saveProject(project);

					return project;
				})),
			);
	}

	deleteProject(projectId: string): Observable<void> {
		localStorage.removeItem(this.getProjectKey(projectId));
		return of();
	}

	renameProject(projectId: string, name: string): Observable<[Project, ProjectInfo[]]> {
		return forkJoin([
			this.getProject(projectId),
			this.getProjectList(),
		]).pipe(
			map(([project, list]) => {

				project.name = name;

				const projectElem = list.find(p => p.id === projectId);

				if (projectElem) {
					projectElem.name = name;
				}

				this.set(this.projectListKey, list);
				this.saveProject(project);

				return [project, list];
			}),
		);
	}

	createProject(name: string, chainId: string): Observable<Project> {
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

		this.saveProject(project);

		return this.getProjectList().pipe(
			map(list => {
				list.push({
					id: project.id,
					name: project.name,
					chainId: project.chainId,
				});

				this.set(this.projectListKey, list);

				return project;
			}),
		);
	}

	addAbi(projectId: string, content: AbiJson, name: string = content.name, wasm?: string): Observable<Project> {
		const abiId = uuid.v4();

		return this.getProject(projectId)
			.pipe(
				switchMap((project) => {
					if (wasm) {
						return this.setWasm(projectId, abiId, wasm).pipe(
							map(() => project),
						);
					}

					return of(project);
				}),
				map((project => {
					const abi: ProjectAbi = {
						id: abiId,
						projectId,
						name,
						content,
						hasWasm: !!wasm,
					};

					project.abiInterfaces.push(abi);

					this.saveProject(project);

					return project;
				})),
			);
	}

	renameAbi(projectId: string, abiId: string, name: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map((project => {
					const abi = project.abiInterfaces.find(sc => sc.id === abiId);

					if (!abi) {
						throw new Error('Abi interface not found');
					}

					abi.name = name;

					this.saveProject(project);

					return project;
				})),
			);
	}

	deleteAbi(projectId: string, abiId: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					project.abiInterfaces = project.abiInterfaces.filter(abi => abi.id !== abiId);
					project.smartContracts = project.smartContracts.filter(sc => sc.abiId !== abiId);

					this.saveProject(project);

					return project;
				}),
			);
	}

	getWasm(projectId: string, abiId: string): Observable<string> {
		const project: string | undefined = localStorage.getItem(this.getWasmKey(projectId, abiId)) || undefined;

		if (!project) {
			return throwError(new Error(`Wasm "${abiId}" not found.`));
		}

		return of(project);
	}

	setWasm(projectId: string, abiId: string, wasm: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				switchMap(project => {
					const abi = project.abiInterfaces.find(abi => abi.id === abiId);

					if (!abi) {
						return throwError(new Error(`Abi interface "${abiId}" not found`));
					}

					abi.wasmSize = new Blob([wasm]).size;
					abi.hasWasm = true;

					this.saveProject(project);

					localStorage.setItem(this.getWasmKey(projectId, abiId), wasm);

					return of(project);
				}),
			);
	}

	deleteWasm(projectId: string, abiId: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				switchMap(project => {
					const abi = project.abiInterfaces.find(abi => abi.id === abiId);

					if (!abi) {
						return throwError(new Error(`Abi interface "${abiId}" not found`));
					}

					abi.wasmSize = undefined;
					abi.hasWasm = false;

					this.saveProject(project);

					localStorage.removeItem(this.getWasmKey(projectId, abiId));

					return of(project);
				}),
			);
	}

	createSmartContract(projectId: string, abiId: string, name: string, address: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map((project => {
					const sc: ProjectSmartContract = {
						id: uuid.v4(),
						name,
						abiId,
						projectId,
						address,
					};

					project.smartContracts.push(sc);

					this.saveProject(project);

					return project;
				})),
			);
	}

	renameSmartContract(projectId: string, scId: string, name: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map((project => {
					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Smart contract not found');
					}

					sc.name = name;

					this.saveProject(project);

					return project;
				})),
			);
	}

	deleteSmartContract(projectId: string, scId: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					project.smartContracts = project.smartContracts.filter(sc => sc.id !== scId);

					this.saveProject(project);

					return project;
				}),
			);
	}

	setScAddress(projectId: string, scId: string, address: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					const sc = project.smartContracts.find(sc => sc.id === scId);

					if (!sc) {
						throw new Error('Sc not found');
					}

					sc.address = address;

					this.saveProject(project);

					return project;
				}),
			);
	}

	addToken(projectId: string, tokenAddress: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					const duplicate = project.tokens.find(id => id === tokenAddress);

					if (duplicate) {
						throw new Error('Token already exists in this project');
					}

					project.tokens.push(tokenAddress);

					this.saveProject(project);

					return project;
				}),
			);
	}

	deleteToken(projectId: string, identifier: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					project.tokens = project.tokens.filter(token => token !== identifier);

					this.saveProject(project);

					return project;
				}),
			);
	}

	addWallet(projectId: string, wallet: ProjectWallet): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					project.wallets.push(wallet);

					this.saveProject(project);

					return project;
				}),
			);
	}

	renameWallet(projectId: string, address: string, name: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					const wallet = project.wallets.find(w => w.address === address);

					if (!wallet) {
						throw new Error('Wallet not found');
					}

					wallet.name = name;

					this.saveProject(project);

					return project;
				}),
			);
	}

	deleteWallet(projectId: string, address: string): Observable<Project> {
		return this.getProject(projectId)
			.pipe(
				map(project => {
					project.wallets = project.wallets.filter(w => w.address !== address);

					this.saveProject(project);

					return project;
				}),
			);
	}

	logAction(action: ActionHistoryElement): Observable<ActionHistoryElement[]> {
		return this.getActionHistory(action.projectId)
			.pipe(
				map(list => {
					list = [
						action,
						...list,
					];

					this.set(this.getActionHistoryKey(action.projectId), list);

					return list;
				}),
			);
	}

	getActionHistory(projectId: string): Observable<ActionHistoryElement[]> {
		const history: ActionHistoryElement[] | undefined = this.get(this.getActionHistoryKey(projectId));

		if (!history) {
			this.set(this.getActionHistoryKey(projectId), []);

			return of([]);
		}

		return of(history);
	}

	clearActionHistory(projectId: string): Observable<void> {
		this.set(this.getActionHistoryKey(projectId), []);

		return of(undefined);
	}

	updateAction(projectId: string, id: string, options: UpdateActionHistoryElementOptions): Observable<ActionHistoryElement[]> {
		return this.getActionHistory(projectId)
			.pipe(
				map(list => {
					const item = list.find(i => i.id === id);

					if (!item) {
						throw new Error(`Action history element (${id}) not found`);
					}

					item.status = options.status;

					if (options.concatTitle) {
						item.title += options.concatTitle;
					}

					this.set(this.getActionHistoryKey(projectId), list);

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
		return this.getProject(data.projectId).pipe(
			map(project => {
				const existingAddress = project.addressBook.find(a => a.address === data.address);

				if (existingAddress) {
					throw new Error('Address already exists');
				}

				project.addressBook.push(data);

				this.saveProject(project);

				return project;
			}),
		);
	}

	renameProjectAddress(projectId: string, address: string, name: string): Observable<Project> {
		return this.getProject(projectId).pipe(
			map(project => {
				const addressElem = project.addressBook.find(a => a.address === address);

				if (!addressElem) {
					throw new Error('Address not found');
				}

				addressElem.name = name;

				this.saveProject(project);

				return project;
			}),
		);
	}

	deleteProjectAddress(projectId: string, address: string): Observable<Project> {
		return this.getProject(projectId).pipe(
			map(project => {
				project.addressBook = project.addressBook.filter(a => a.address !== address);

				this.saveProject(project);

				return project;
			}),
		);
	}

	private getWasmKey(projectId: string, abiId: string): string {
		return `${this.projectKey}.${projectId}.wasm.${abiId}`;
	}

	private saveProject(project: Project): void {
		this.set(this.getProjectKey(project.id), project);
	}

	private getActionHistoryKey(id: string): string {
		return `${this.actionHistoryKey}.${id}`;
	}

	private getProjectKey(id: string): string {
		return `${this.projectKey}.${id}`;
	}

	private set<T>(key: string, value: T): void {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	private get<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key) || 'null');
	}
}
