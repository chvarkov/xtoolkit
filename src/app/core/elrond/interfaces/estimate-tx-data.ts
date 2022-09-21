export interface IEstimateTxData {
	value: string;
	receiver: string;
	sender: string;
	data?: string;
	chainID: string;
	version: number;
}
