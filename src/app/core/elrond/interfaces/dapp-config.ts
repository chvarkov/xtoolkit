export interface IDappConfig {
	id: string;
	name: string;
	egldLabel: string;
	decimals: string;
	egldDenomination: string;
	gasPerDataByte: string;
	apiTimeout: string;
	walletConnectDeepLink: string;
	walletConnectBridgeAddresses: string[];
	walletAddress: string;
	apiAddress: string;
	explorerAddress: string;
	chainId: string;
}
