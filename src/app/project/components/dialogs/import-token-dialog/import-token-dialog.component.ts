import { Component, OnInit } from '@angular/core';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { Observable } from 'rxjs';
import { ITokenInfo } from '../../../../core/elrond/interfaces/token-info';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { ProjectAction } from '../../../store/project.action';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';

@Component({
	selector: 'app-import-token-dialog',
	templateUrl: './import-token-dialog.component.html',
	styleUrls: ['./import-token-dialog.component.scss']
})
export class ImportTokenDialogComponent extends AbstractModalDialog implements OnInit {
	tokenId = '';

	dialogRef!: DialogRef<{projectId: string}, string>;

	tokens$!: Observable<ITokenInfo[]>;

	constructor(private readonly store: Store) {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '400px';
		this.dialogRef.options.height = '420px';

		this.tokens$ = this.store.select(ProjectSelector.tokens(this.dialogRef.data.projectId));
	}

	submit(): void {
		this.dialogRef.submit(this.tokenId.trim());
	}

	onChangeSearchInput(e: Event): void {
		const value = (<HTMLInputElement>e.target).value;

		this.store.dispatch(ProjectAction.searchTokens({
			projectId: this.dialogRef.data.projectId,
			options: {search: value},
		}));
	}
}
