import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';

@Component({
	selector: 'app-no-token-placeholder',
	templateUrl: './no-token-placeholder.component.html',
	styleUrls: ['./no-token-placeholder.component.scss']
})
export class NoTokenPlaceholderComponent implements OnInit {
	@Input() identifier = '';
	@Input() network?: INetworkEnvironment;

	@Output() reload: EventEmitter<void> = new EventEmitter<void>();

	constructor() {
	}

	ngOnInit(): void {
	}

	exploreToken(): void {
		if (!this.network) {
			return;
		}

		window.open(`${this.network.explorerUrl}/tokens/${this.identifier}`);
	}
}
