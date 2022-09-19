import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../../project/store/project.action';
import { ProjectScAbi } from '../../../../core/data-provider/data-provider';
import { Observable, Subject, Subscription } from 'rxjs';
import { isValidAddress } from '../../../../core/validators/address-validator';
import { Clipboard } from '@angular/cdk/clipboard';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../../network/store/network.selector';

@Component({
	selector: 'app-sc-viewer-header',
	templateUrl: './sc-viewer-header.component.html',
	styleUrls: ['./sc-viewer-header.component.scss']
})
export class ScViewerHeaderComponent implements OnInit, OnDestroy {
	@Input() sc!: ProjectScAbi;
	@Input() address: string = '';
	@Input() chainId: string = '';

	addressChangesSubject = new Subject<string>();

	sub = new Subscription();

	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly store: Store,
				readonly clipboard: Clipboard) {
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));

		this.sub.add(this.addressChangesSubject.pipe(
			debounceTime(100),
		).subscribe((address) => {
			if (!this.sc) {
				return;
			}

			this.store.dispatch(ProjectAction.setScAddress({
				projectId: this.sc.projectId,
				scId: this.sc.id,
				address,
			}));
		}));
	}

	onChangeAddress(event: Event): void {
		const value = (<HTMLInputElement>(event.target)).value;

		this.addressChangesSubject.next(value);
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	explore(url: string): void {
		window.open(`${url}/accounts/${this.address}`, '_blank');
	}
}
