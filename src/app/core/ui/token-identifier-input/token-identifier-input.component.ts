import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../elrond/interfaces/network-environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../network/store/network.selector';
import { ProjectSelector } from '../../../project/store/project.selector';
import { map } from 'rxjs/operators';
import { TokenIdentifierValue } from '@elrondnetwork/erdjs/out';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
	selector: 'app-token-identifier-input',
	templateUrl: './token-identifier-input.component.html',
	styleUrls: ['./token-identifier-input.component.scss']
})
export class TokenIdentifierInputComponent implements OnInit {
	@Input() projectId: string = '';
	@Input() chainId: string = ''
	@Input() identifier: string = '';

	@Output() changed: EventEmitter<string> = new EventEmitter<string>();

	@Input() showIdentifiers = true;

	isOptionsVisible = false;

	network$?: Observable<INetworkEnvironment | undefined>;

	tokenIdentifiers$?: Observable<string[]>;

	private prevValue?: string;

	constructor(readonly clipboard: Clipboard,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		if (this.showIdentifiers) {
			this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
			this.tokenIdentifiers$ = this.store.select(ProjectSelector.projectById(this.projectId)).pipe(
				map(project => project?.tokens || []),
				map(tokens => [TokenIdentifierValue.egld().toString(), ...tokens]),
			);
		}
	}

	onFocus(): void {
		this.isOptionsVisible = true;
	}

	onBlur(): void {
		setTimeout(() => this.isOptionsVisible = false, 200);
	}

	explore(url: string): void {
		window.open(`${url}/tokens/${this.identifier}`, '_blank');
	}

	isInvalidIdentifier(identifier: string): boolean {
		return false; // TODO: add validation
	}

	onChangeTokenIdentifier(event: MatAutocompleteSelectedEvent): void {
		this.setValue(event.option.value);
	}

	onSelectTokenIdentifier(identifier: string): void {
		this.setValue(identifier);

		this.identifier = identifier;

		this.isOptionsVisible = false;
	}

	setValue(value: string): void {
		if (this.prevValue !== value) {
			this.prevValue = value;
			this.changed.next(value);
		}
	}
}
