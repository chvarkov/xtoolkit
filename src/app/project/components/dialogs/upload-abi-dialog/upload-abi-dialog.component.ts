import { Component, Inject, OnInit } from '@angular/core';
import { ProjectAbi } from '../../../../core/data-provider/data-provider';
import { AbiJson } from '../../../../core/elrond/builders/sc.builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
		types: [],
		endpoints: [],
	};

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
			this.endpoints = this.abi.endpoints?.length || 0;
			this.types = Object.keys(this.abi.types).length || 0;
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
