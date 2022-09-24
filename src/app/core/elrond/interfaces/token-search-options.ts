export interface ITokenSearchOptions {
	from?: number;
	to?: number;
	search?: string;
	name?: string;
	identifier?: string;
	identifiers?: string;
	sort?: 'accounts' | 'transactions' | 'price' | 'marketCap';
	order?: 'asc' | 'desc'
}
