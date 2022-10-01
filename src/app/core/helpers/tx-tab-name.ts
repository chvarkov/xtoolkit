export function txTabName(txHash: string, shortenHashLen = 6): string {
	return `Tx: ${txHash.substring(txHash.length - shortenHashLen, txHash.length)}`;
}
