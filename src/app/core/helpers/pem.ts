import { Mnemonic } from '@elrondnetwork/erdjs-walletcore';

export class Pem {
	constructor(private readonly content: string) {
	}

	toString(): string {
		return this.content;
	}

	static fromMnemonic(mnemonic: Mnemonic): string {
		const buff = mnemonic.deriveKey();

		const secretKeyHex = buff.hex();
		const pubKeyHex = buff.generatePublicKey().hex();

		const combinedKeys = Buffer.from(secretKeyHex + pubKeyHex).toString(
			'base64'
		);

		const addressFromPubKey = buff.generatePublicKey().toAddress().bech32();

		const header = `-----BEGIN PRIVATE KEY for ${addressFromPubKey}-----`;
		const footer = `-----END PRIVATE KEY for ${addressFromPubKey}-----`;

		return `${header}\n${combinedKeys.replace(/([^\n]{1,64})/g, '$1\n')}${footer}`;
	}
}
