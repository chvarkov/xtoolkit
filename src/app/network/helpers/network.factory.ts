import { IDappConfig } from '../../core/elrond/interfaces/dapp-config';
import { INetworkEnvironment } from '../../core/elrond/interfaces/network-environment';

export class NetworkFactory {
	static createFromDappConfig(dappConfig: IDappConfig): INetworkEnvironment {
		return {
			name: dappConfig.name,
			apiUrl: dappConfig.apiAddress,
			explorerUrl: dappConfig.explorerAddress,
			chainId: dappConfig.chainId,
			egldDenomination: +dappConfig.egldDenomination,
			egldLabel: dappConfig.egldLabel,
			gasPerDataByte: +dappConfig.gasPerDataByte,
			walletConnectDeepLink: dappConfig.walletAddress,
			walletConnectBridgeAddresses: dappConfig.walletConnectBridgeAddresses,
		};
	}
}
