import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../elrond/interfaces/network-environment';
import { AbiJson } from '../elrond/builders/sc.builder';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export interface GeneratedWallet {
	name: string;
	address: string;
	mnemonic: string[];
}

export interface ProjectScAbi {
	name?: string;
	id: string;
	projectId: string;
	address: string;
	abi: AbiJson;
}

export interface Project {
	id: string;
	chainId: string;
	name: string;
	smartContracts: ProjectScAbi[];
	wallets: GeneratedWallet[];
	tokens: string[];
}

export enum ActionStatus {
	Pending = 'pending',
	Success = 'success',
	Fail = 'fail',
}

export enum ActionType {
	Transaction = 'tx',
	Query = 'query',
}

export interface ActionHistoryElement {
	id: string,
	type: ActionType,
	chainId: string,
	title: string;
	caller?: string
	txHash?: string
	status: ActionStatus;
	data: Record<string, any>;
	timestamp: number;
}

export interface DataProvider {
	getNetworks(): Observable<INetworkEnvironment[]>;

	getProjects(): Observable<Project[]>;

	createProject(name: string, chainId: string): Observable<Project>;

	addAbi(projectId: string, abi: AbiJson, name?: string): Observable<Project>;

	setScAddress(projectId: string, scId: string, address: string): Observable<Project>;

	renameProject(projectId: string, name: string): Observable<Project>;

	addWallet(projectId: string, wallet: GeneratedWallet): Observable<Project>;

	renameWallet(projectId: string, address: string, name: string): Observable<Project>;

	deleteWallet(projectId: string, address: string): Observable<Project>;

	addToken(projectId: string, tokenAddress: string): Observable<Project>;

	logAction(action: ActionHistoryElement): Observable<ActionHistoryElement[]>;

	getActionHistory(): Observable<ActionHistoryElement[]>;

	updateActionStatus(id: string, status: ActionStatus): Observable<ActionHistoryElement[]>;
}
