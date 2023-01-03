export interface INetworkEnvironment {
	name: string;
	egldLabel: string;
	apiUrl: string;
	explorerUrl: string;
	chainId: string;
	gasPerDataByte: number;
	egldDenomination: number;
	walletConnectDeepLink: string;
	walletConnectBridgeAddresses: string[];
}
