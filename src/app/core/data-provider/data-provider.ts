import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../elrond/interfaces/network-environment';
import { AbiJson } from '../elrond/builders/sc.builder';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export enum WalletSignStrategy {
	Secret = 'secret',
	Mnemonic = 'mnemonic',
	Pem = 'pem',
	MobileApp = 'mobile_app',
}

export interface ProjectWallet {
	name: string;
	address: string;
	signStrategy: WalletSignStrategy;
	mnemonic: string[]; // todo: remove it
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
	wallets: ProjectWallet[];
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
	wasmSize?: number;
	hasWasm: boolean;
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
	Tx = 'tx',
}

export interface ActionHistoryElement {
	id: string;
	projectId: string;
	type: ActionType;
	chainId: string;
	title: string;
	caller: string;
	txHash?: string;
	status: ActionStatus;
	data: Record<string, any>;
	timestamp: number;
}

export interface UpdateActionHistoryElementOptions {
	status: ActionStatus;
	concatTitle?: string;
}

export interface DataProvider {
	getNetworks(): Observable<INetworkEnvironment[]>;

	addNetwork(network: INetworkEnvironment): Observable<INetworkEnvironment[]>;

	updateNetwork(chainId: string, network: INetworkEnvironment): Observable<INetworkEnvironment[]>;

	deleteNetwork(chainId: string): Observable<INetworkEnvironment[]>;

	getActiveProjectId(): Observable<string>;

	getProject(id: string): Observable<Project>;

	getProjectList(): Observable<ProjectInfo[]>;

	closeProject(): Observable<void>;

	openProject(projectId: string): Observable<Project>;

	getActiveProject(): Observable<Project | undefined>;

	getProjects(): Observable<Project[]>;

	updateProjectNetwork(projectId: string, chainId: string): Observable<Project>;

	createProject(name: string, chainId: string): Observable<Project>;

	deleteProject(projectId: string): Observable<void>;

	addAbi(projectId: string, abi: AbiJson, name?: string, wasm?: string): Observable<Project>;

	renameAbi(projectId: string, abiId: string, name: string): Observable<Project>;

	deleteAbi(projectId: string, abiId: string): Observable<Project>;

	getWasm(projectId: string, abiId: string): Observable<string>;

	setWasm(projectId: string, abiId: string, wasm: string): Observable<Project>;

	deleteWasm(projectId: string, abiId: string): Observable<Project>;

	createSmartContract(projectId: string, abiId: string, name: string, address: string): Observable<Project>;

	renameSmartContract(projectId: string, scId: string, name: string): Observable<Project>;

	deleteSmartContract(projectId: string, scId: string): Observable<Project>;

	setScAddress(projectId: string, scId: string, address: string): Observable<Project>;

	renameProject(projectId: string, name: string): Observable<[Project, ProjectInfo[]]>;

	addWallet(projectId: string, wallet: ProjectWallet): Observable<Project>;

	renameWallet(projectId: string, address: string, name: string): Observable<Project>;

	deleteWallet(projectId: string, address: string): Observable<Project>;

	addToken(projectId: string, identifier: string): Observable<Project>;

	deleteToken(projectId: string, identifier: string): Observable<Project>;

	logAction(action: ActionHistoryElement): Observable<ActionHistoryElement[]>;

	getActionHistory(projectId: string): Observable<ActionHistoryElement[]>;

	updateAction(projectId: string, id: string, options: UpdateActionHistoryElementOptions): Observable<ActionHistoryElement[]>;

	clearActionHistory(projectId: string): Observable<void>;

	addTokenIssueTransaction(data: PendingTokenIssue): Observable<PendingTokenIssue[]>;

	getTokenIssueWaitList(): Observable<PendingTokenIssue[]>;

	deleteTokenIssueTransaction(txHash: string): Observable<PendingTokenIssue[]>;

	addProjectAddress(data: ProjectAddress): Observable<Project>;

	renameProjectAddress(projectId: string, address: string, name: string): Observable<Project>;

	deleteProjectAddress(projectId: string, address: string): Observable<Project>;
}
