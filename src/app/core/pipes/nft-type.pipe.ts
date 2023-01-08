import { Pipe, PipeTransform } from '@angular/core';
import { NftType } from '../elrond/interfaces/nft';

@Pipe({
	name: 'nftType',
	pure: true,
})
export class NftTypePipe implements PipeTransform {

	transform(value: NftType): string {
		switch (value) {
			case NftType.NonFungibleESDT:
				return 'NFT';
			case NftType.SemiFungibleESDT:
				return 'SFT';
			default:
				return '';
		}
	}

}
