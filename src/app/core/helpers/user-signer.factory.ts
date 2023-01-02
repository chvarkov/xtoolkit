import { UserSigner } from '@elrondnetwork/erdjs-walletcore';
import { Pem } from './pem';
import { Mnemonic } from '@elrondnetwork/erdjs-walletcore/out';
import { UserSecretKey } from '@elrondnetwork/erdjs-walletcore/out/userKeys';

export class UserSignerFactory {
	static fromMnemonic(mnemonic: string): UserSigner {
		return UserSigner.fromPem(Pem.fromMnemonic(Mnemonic.fromString(mnemonic)));
	}

	static fromPem(pem: string): UserSigner {
		// return UserSigner.fromPem(pem);
		return new UserSigner(UserSecretKey.fromPem(pem));
	}

	static fromSecret(secret: string): UserSigner {
		return new UserSigner(UserSecretKey.fromString(secret));
	}
}
