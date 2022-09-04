export interface ITokenAssets {
	website: string;
	description: string;
	social: {
		email: string;
		blog: string;
		twitter: string;
		whitepaper: string;
		coinmarketcap: string;
		coingecko: string;
	};
	status: 'active';
	pngUrl: string;
	svgUrl: string;
}

export interface ITokenPosition {
	identifier: string;
	name: string;
	ticker: string;
	owner: string;
	decimals: number;
	isPaused: boolean;
	assets: ITokenAssets;
	transactions: number;
	accounts: number;
	canUpgrade: boolean;
	canMint: boolean;
	canBurn: boolean;
	canChangeOwner: boolean;
	canPause: boolean;
	canFreeze: boolean;
	canWipe: boolean;
	price: number;
	marketCap: number;
	supply: string;
	circulatingSupply: string;
	balance: string;
	valueUsd: number;
}

export interface ITokenPositionsFilter {
	from?: number;
	size?: number;
	search?: string;
	name?: string;
	identifier?: string;
}
