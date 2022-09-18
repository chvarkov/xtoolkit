import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../elrond/interfaces/network-environment';
import { AbiJson } from '../elrond/builders/sc.builder';

export const DATA_PROVIDER = 'CORE:DATA_PROVIDER';

export interface GeneratedWallet {
	name: string;
	address: string;
	mnemonic: string[];
}

export interface NetworkInfo {
	list: INetworkEnvironment[];
	selected: INetworkEnvironment;
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
	selectedScId?: string;
}

export interface DataProvider {
	getNetworks(): Observable<NetworkInfo>;

	selectNetwork(network: INetworkEnvironment): Observable<void>

	getProjects(): Observable<Project[]>;

	createProject(name: string, chainId: string): Observable<Project>;

	addAbi(projectId: string, abi: AbiJson, name?: string): Observable<Project>;

	setScAddress(projectId: string, scId: string, address: string): Observable<Project>;

	addWallet(projectId: string, wallet: GeneratedWallet): Observable<Project>;

	addToken(projectId: string, tokenAddress: string): Observable<Project>;
}
