import { ITokenAssets } from './token-position';

export interface ITokenInfo {
	accounts: number;
	assets: ITokenAssets;
	burnt: string;
	canBurn: boolean;
	canChangeOwner: boolean;
	canFreeze: boolean;
	canMint: boolean;
	canPause: boolean;
	canUpgrade: boolean;
	canWipe: boolean;
	circulatingSupply: string;
	decimals: string;
	identifier: string;
	initialMinted: string;
	isPaused: string;
	minted: string;
	name: string;
	owner: string;
	supply: string;
	ticker: string;
	transactions: number;
}
