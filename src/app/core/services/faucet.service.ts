import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FaucetService {
	private readonly faucetUrl = 'https://r3d4.fr/faucet';

	gotoFaucet(): void {
		window.open(this.faucetUrl, '_blank');
	}
}
