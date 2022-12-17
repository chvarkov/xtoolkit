import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-create-project-dialog',
	templateUrl: './create-project-dialog.component.html',
	styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
	projectName = '';

	chainId = ''

	networks$: Observable<INetworkEnvironment[]>;

	constructor(private readonly store: Store,
				public dialogRef: MatDialogRef<CreateProjectDialogComponent>) {
		this.networks$ = this.store.select(NetworkSelector.networks);
	}

	ngOnInit(): void {
	}

	create(): void {
		this.dialogRef.close({name: this.projectName, chainId: this.chainId});
	}

	onChangeChainId(chainId: string): void {
		this.chainId = chainId;
	}
}
