import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../elrond/interfaces/network-environment';
import { AbiJson } from '../elrond/builders/sc.builder';
import { map } from 'rxjs/operators';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export interface GeneratedWallet {
	name: string;
	address: string;
	mnemonic: string[];
}

export interface ProjectSmartContract {
	name: string;
	id: string;
	abiId: string;
	projectId: string;
	address: string;
}

export interface Project extends ProjectInfo {
	abiInterfaces: ProjectAbi[];
	smartContracts: ProjectSmartContract[];
	wallets: GeneratedWallet[];
	tokens: string[];
	addressBook: ProjectAddress[];
}

export interface ProjectInfo {
	id: string;
	chainId: string;
	name: string;
}

export interface ProjectAbi {
	id: string;
	projectId: string;
	name: string;
	content: AbiJson;
}

export interface ProjectAddress {
	projectId: string;
	name: string;
	address: string;
	type: 'wallet' | 'sc';
	savedAt: number;
}

export interface PendingTokenIssue {
	actionId: string;
	projectId: string;
	chainId: string;
	txHash: string;
}

export enum ActionStatus {
	Pending = 'pending',
	Success = 'success',
	Fail = 'fail',
}

export enum ActionType {
	Issue = 'issue',
	Transaction = 'tx',
	Query = 'query',
}

export interface ActionHistoryElement {
	id: string;
	projectId: string;
	type: ActionType;
	chainId: string;
	title: string;
	caller?: string;
	txHash?: string;
	status: ActionStatus;
	data: Record<string, any>;
	timestamp: number;
}

export interface DataProvider {
	getNetworks(): Observable<INetworkEnvironment[]>;

	addNetwork(network: INetworkEnvironment): Observable<INetworkEnvironment[]>;

	updateNetwork(chainId: string, network: INetworkEnvironment): Observable<INetworkEnvironment[]>;

	deleteNetwork(chainId: string): Observable<INetworkEnvironment[]>;

	getActiveProjectId(): Observable<string | undefined>;

	getProject(id: string): Observable<Project>;

	getProjectList(): Observable<ProjectInfo[]>;

	openProject(projectId: string): Observable<Project>;

	getActiveProject(): Observable<Project | undefined>;

	getProjects(): Observable<Project[]>;

	updateProjectNetwork(projectId: string, chainId: string): Observable<Project>;

	createProject(name: string, chainId: string): Observable<Project>;

	deleteProject(projectId: string): Observable<void>;

	addAbi(projectId: string, abi: AbiJson, name?: string): Observable<Project>;

	renameAbi(projectId: string, abiId: string, name: string): Observable<Project>;

	deleteAbi(projectId: string, abiId: string): Observable<Project>;

	createSmartContract(projectId: string, abiId: string, name: string, address: string): Observable<Project>;

	renameSmartContract(projectId: string, scId: string, name: string): Observable<Project>;

	deleteSmartContract(projectId: string, scId: string): Observable<Project>;

	setScAddress(projectId: string, scId: string, address: string): Observable<Project>;

	renameProject(projectId: string, name: string): Observable<Project>;

	addWallet(projectId: string, wallet: GeneratedWallet): Observable<Project>;

	renameWallet(projectId: string, address: string, name: string): Observable<Project>;

	deleteWallet(projectId: string, address: string): Observable<Project>;

	addToken(projectId: string, identifier: string): Observable<Project>;

	deleteToken(projectId: string, identifier: string): Observable<Project>;

	logAction(action: ActionHistoryElement): Observable<ActionHistoryElement[]>;

	getActionHistory(): Observable<ActionHistoryElement[]>;

	updateActionStatus(id: string, status: ActionStatus): Observable<ActionHistoryElement[]>;

	clearActionHistory(): Observable<void>;

	addTokenIssueTransaction(data: PendingTokenIssue): Observable<PendingTokenIssue[]>;

	getTokenIssueWaitList(): Observable<PendingTokenIssue[]>;

	deleteTokenIssueTransaction(txHash: string): Observable<PendingTokenIssue[]>;

	addProjectAddress(data: ProjectAddress): Observable<Project>;

	renameProjectAddress(projectId: string, address: string, name: string): Observable<Project>;

	deleteProjectAddress(projectId: string, address: string): Observable<Project>;
}
