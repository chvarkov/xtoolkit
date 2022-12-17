import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { Store } from '@ngrx/store';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-update-project-network-dialog',
	templateUrl: './update-project-network-dialog.component.html',
	styleUrls: ['./update-project-network-dialog.component.scss']
})
export class UpdateProjectNetworkDialogComponent implements OnInit {
	chainId = '';

	networks$: Observable<INetworkEnvironment[]>;

	constructor(@Inject(MAT_DIALOG_DATA) readonly data: string,
				readonly dialogRef: MatDialogRef<UpdateProjectNetworkDialogComponent>,
				private readonly store: Store) {
		this.networks$ = this.store.select(NetworkSelector.networks);
	}

	ngOnInit(): void {
	}

	update(): void {
		this.dialogRef.close(this.chainId);
	}

	onChangeNetwork(chainId: string): void {
		this.chainId = chainId;
	}
}
