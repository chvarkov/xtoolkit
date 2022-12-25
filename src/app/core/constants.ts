import { INetworkEnvironment } from './elrond/interfaces/network-environment';

export const DEFAULT_NETWORKS: INetworkEnvironment[] = [
	{
		name: 'Testnet',
		gatewayUrl: 'https://testnet-api.elrond.com',
		explorerUrl: 'https://testnet-explorer.elrond.com',
		chainId: 'T',
	},
	{
		name: 'Devnet',
		gatewayUrl: 'https://devnet-api.elrond.com',
		explorerUrl: 'https://devnet-explorer.elrond.com',
		chainId: 'D',
	},
	{
		name: 'Mainnet',
		gatewayUrl: 'https://api.elrond.com',
		explorerUrl: 'https://explorer.elrond.com',
		chainId: '1',
	},
];

export const NOT_MAINNET_CHAIN_IDS = ['D', 'T'];
