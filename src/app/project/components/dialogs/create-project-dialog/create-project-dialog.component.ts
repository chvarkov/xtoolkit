import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { INetworkEnvironment } from '../../../../core/elrond/interfaces/network-environment';
import { NetworkSelector } from '../../../../network/store/network.selector';
import { SelectElement } from '../../../../core/ui/select/select.component';

@Component({
	selector: 'app-create-project-dialog',
	templateUrl: './create-project-dialog.component.html',
	styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent extends AbstractModalDialog implements OnInit {
	projectName = '';

	chainId = ''

	dialogRef!: DialogRef<void, { name: string, chainId: string }>;

	networks$: Observable<INetworkEnvironment[]>;

	constructor(private readonly store: Store) {
		super();

		this.networks$ = this.store.select(NetworkSelector.networks);
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '210px';
	}

	create(): void {
		this.dialogRef.submit({name: this.projectName, chainId: this.chainId});
	}

	onSelectNetwork(elem: SelectElement): void {
		this.chainId = elem.value || '';
	}
}
