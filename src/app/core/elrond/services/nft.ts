export interface INftMedia {
	url: string;
	originalUrl: string;
	thumbnailUrl: string;
	fileType: string;
	fileSize: number;
}

export enum NftType {
	NonFungibleESDT = 'NonFungibleESDT',
	SemiFungibleESDT = 'SemiFungibleESDT',
}

export interface INft {
	identifier: string;
	collection: string;
	nonce: number;
	type: NftType;
	name: string;
	creator: string;
	royalties: number;
	uris: string[];
	url: string;
	media: INftMedia[];
	isWhitelistedStorage: boolean;
	metadata: Record<string, any>;
	ticker: string;
	isNsfw: boolean;
	tags?: string[];
	balance: string;
}
