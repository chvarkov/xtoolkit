import { INetworkEnvironment } from './interfaces/network-environment';

export const DEFAULT_NETWORKS: INetworkEnvironment[] = [
	{
		name: 'Testnet',
		gatewayUrl: 'https://testnet-api.elrond.com',
		explorerUrl: 'https://testnet-explorer.elrond.com',
	},
	{
		name: 'Devnet',
		gatewayUrl: 'https://devnet-api.elrond.com',
		explorerUrl: 'https://devnet-explorer.elrond.com',
	},
	{
		name: 'Mainnet',
		gatewayUrl: 'https://api.elrond.com',
		explorerUrl: 'https://explorer.elrond.com',
	},
];
