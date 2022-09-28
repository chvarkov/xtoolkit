import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';

@Component({
	selector: 'app-update-project-network-dialog',
	templateUrl: './update-project-network-dialog.component.html',
	styleUrls: ['./update-project-network-dialog.component.scss']
})
export class UpdateProjectNetworkDialogComponent extends AbstractModalDialog implements OnInit {
	chainId = '';

	dialogRef!: DialogRef<string, string>;

	networks$: Observable<INetworkEnvironment[]>;

	constructor(private readonly store: Store) {
		super();

		this.networks$ = this.store.select(NetworkSelector.networks);
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '194px';
	}

	update(): void {
		this.dialogRef.submit(this.chainId);
	}

	onChangeNetwork(chainId: string): void {
		this.chainId = chainId;
	}
}
