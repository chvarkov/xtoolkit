import { INetworkEnvironment } from './elrond/interfaces/network-environment';

export const DEFAULT_WALLET_CONNECT_BRIDGE_URL = 'https://bridge.walletconnect.org';
export const DEFAULT_WALLET_CONNECT_DEEP_LINK = 'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/';

export const DEFAULT_NETWORKS: INetworkEnvironment[] = [
	{
		name: 'Testnet',
		apiUrl: 'https://testnet-api.elrond.com',
		explorerUrl: 'https://testnet-explorer.elrond.com',
		chainId: 'T',
		gasPerDataByte: 1500,
		egldLabel: 'xEGLD',
		egldDenomination: 18,
		walletConnectBridgeAddresses: [DEFAULT_WALLET_CONNECT_BRIDGE_URL],
		walletConnectDeepLink: DEFAULT_WALLET_CONNECT_DEEP_LINK,
	},
	{
		name: 'Devnet',
		apiUrl: 'https://devnet-api.elrond.com',
		explorerUrl: 'https://devnet-explorer.elrond.com',
		chainId: 'D',
		gasPerDataByte: 1500,
		egldLabel: 'xEGLD',
		egldDenomination: 18,
		walletConnectBridgeAddresses: [DEFAULT_WALLET_CONNECT_BRIDGE_URL],
		walletConnectDeepLink: DEFAULT_WALLET_CONNECT_DEEP_LINK,
	},
	{
		name: 'Mainnet',
		apiUrl: 'https://api.elrond.com',
		explorerUrl: 'https://explorer.elrond.com',
		chainId: '1',
		gasPerDataByte: 1500,
		egldLabel: 'eGLD',
		egldDenomination: 18,
		walletConnectBridgeAddresses: [DEFAULT_WALLET_CONNECT_BRIDGE_URL],
		walletConnectDeepLink: DEFAULT_WALLET_CONNECT_DEEP_LINK,
	},
];

export const NOT_MAINNET_CHAIN_IDS = ['D', 'T'];
