import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { Project, ProjectAddress } from '../../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { ElrondDataProvider } from '../../../../core/elrond/elrond.data-provider';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Address } from '@elrondnetwork/erdjs/out';
import { switchMap } from 'rxjs/operators';
import { NetworkSelector } from '../../../../network/store/network.selector';

@Component({
	selector: 'app-add-project-address-dialog',
	templateUrl: './add-project-address-dialog.component.html',
	styleUrls: ['./add-project-address-dialog.component.scss']
})
export class AddProjectAddressDialogComponent extends AbstractModalDialog implements OnInit {
	name = '';

	address = '';

	dialogRef!: DialogRef<{ projectId: string }, ProjectAddress>;

	project$?: Observable<Project | undefined>;
	network$?: Observable<INetworkEnvironment | undefined>;

	constructor(private readonly store: Store,
				private readonly elrondDataProvider: ElrondDataProvider) {
		super();
	}

	ngOnInit(): void {
		this.project$ = this.store.select(ProjectSelector.projectById(this.dialogRef.data.projectId));

		this.network$ = this.project$.pipe(
			switchMap((project) => this.store.select(NetworkSelector.networkByChainId(project?.chainId || ''))),
		);

		this.project$.subscribe((proj) => console.log('project', proj));
		this.network$.subscribe((net) => console.log('network', net));

		this.dialogRef.options.width = '560px';
		this.dialogRef.options.height = '260px';
	}

	async create(network: INetworkEnvironment): Promise<void> {
		if (!this.address) {
			return;
		}

		const type = await this.elrondDataProvider.getProxy(network).getAccount(new Address(this.address))
			.then(acc => acc.code ? 'sc' : 'wallet');

		const address: ProjectAddress = {
			address: this.address,
			name: this.name,
			projectId: this.dialogRef.data.projectId,
			type,
			savedAt: Date.now(),
		};

		this.dialogRef.submit(address);
	}
}
