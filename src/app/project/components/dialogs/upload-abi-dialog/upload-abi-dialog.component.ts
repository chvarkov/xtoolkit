import { Component, Inject, OnInit } from '@angular/core';
import { ProjectAbi } from '../../../../core/data-provider/data-provider';
import { AbiJson, ScBuilder } from '../../../../core/elrond/builders/sc.builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SmartContract } from '@multiversx/sdk-core/out';

export interface IUploadedAbi extends Omit<ProjectAbi, 'id'> {
}

@Component({
	selector: 'app-upload-abi-dialog',
	templateUrl: './upload-abi-dialog.component.html',
	styleUrls: ['./upload-abi-dialog.component.scss']
})
export class UploadAbiDialogComponent implements OnInit {
	smartContractName = '';
	fileName = '';

	types = 0;
	endpoints = 0;

	abi: AbiJson = {
		name: '',
		types: {},
		endpoints: [],
	};

	sc?: SmartContract;

	constructor(@Inject(MAT_DIALOG_DATA) private readonly data: {projectId: string},
				readonly dialogRef: MatDialogRef<UploadAbiDialogComponent>) {
	}

	ngOnInit(): void {
	}

	async onFileSelected(event: any) {
		const file: File = event.target.files[0];

		if (file) {
			this.fileName = file.name;
			const content = await file.text();
			this.abi = JSON.parse(content);

			this.smartContractName = this.abi.name;

			this.sc = ScBuilder.build('', this.abi);
		}
	}

	submit(): void {
		this.dialogRef.close({
			name: this.smartContractName,
			content: this.abi,
			projectId: this.data.projectId,
		});
	}
}
