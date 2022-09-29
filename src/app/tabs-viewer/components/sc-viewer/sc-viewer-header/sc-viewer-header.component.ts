import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../../project/store/project.action';
import { ProjectSmartContract } from '../../../../core/data-provider/data-provider';
import { Observable, Subject, Subscription } from 'rxjs';
import { isValidAddress } from '../../../../core/validators/address-validator';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../../network/store/network.selector';

@Component({
	selector: 'app-sc-viewer-header',
	templateUrl: './sc-viewer-header.component.html',
	styleUrls: ['./sc-viewer-header.component.scss']
})
export class ScViewerHeaderComponent implements OnInit, OnDestroy {
	@Input() sc!: ProjectSmartContract;
	@Input() address: string = '';
	@Input() chainId: string = '';

	addressChangesSubject = new Subject<string>();

	sub = new Subscription();

	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly store: Store) {
	}

	isInvalidAddress(address: string): boolean {
		return !isValidAddress(address);
	}

	ngOnInit(): void {
		this.network$ = this.store.select(NetworkSelector.networkByChainId(this.chainId));
	}

	onChangeAddress(address: string): void {
		if (this.sc && isValidAddress(address)) {
			this.store.dispatch(ProjectAction.setScAddress({
				projectId: this.sc.projectId,
				scId: this.sc.id,
				address,
			}));
		}
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
