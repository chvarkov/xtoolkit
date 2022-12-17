import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITokenInfo } from '../../../../core/elrond/interfaces/token-info';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../../../store/project.selector';
import { ProjectAction } from '../../../store/project.action';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-import-token-dialog',
	templateUrl: './import-token-dialog.component.html',
	styleUrls: ['./import-token-dialog.component.scss']
})
export class ImportTokenDialogComponent implements OnInit {
	tokenId = '';

	tokens$!: Observable<ITokenInfo[]>;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string},
				readonly dialogRef: MatDialogRef<any>,
				private readonly store: Store) {
	}

	ngOnInit(): void {

		this.tokens$ = this.store.select(ProjectSelector.tokens(this.data.projectId));
		this.loadToken('');
	}

	submit(): void {
		this.dialogRef.close(this.tokenId.trim());
	}

	onChangeSearchInput(e: Event): void {
		const value = (<HTMLInputElement>e.target).value;

		this.loadToken(value);
	}

	private loadToken(search: string): void {
		this.store.dispatch(ProjectAction.searchTokens({
			projectId: this.data.projectId,
			options: {search},
		}));
	}
}
