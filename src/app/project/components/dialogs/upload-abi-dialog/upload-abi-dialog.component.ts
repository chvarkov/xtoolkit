import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { ProjectAbi } from '../../../../core/data-provider/data-provider';
import { AbiJson } from '../../../../core/elrond/builders/sc.builder';

export interface IUploadedAbi extends Omit<ProjectAbi, 'id'> {
}

@Component({
	selector: 'app-upload-abi-dialog',
	templateUrl: './upload-abi-dialog.component.html',
	styleUrls: ['./upload-abi-dialog.component.scss']
})
export class UploadAbiDialogComponent extends AbstractModalDialog implements OnInit {
	smartContractName = '';
	fileName = '';

	types = 0;
	endpoints = 0;

	abi: AbiJson = {
		name: '',
		types: [],
		endpoints: [],
	};

	dialogRef!: DialogRef<{ projectId: string }, IUploadedAbi>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '200px';
	}

	async onFileSelected(event: any) {
		const file: File = event.target.files[0];

		if (file) {
			this.dialogRef.options.height = '280px';
			this.fileName = file.name;
			const content = await file.text();
			this.abi = JSON.parse(content);

			this.smartContractName = this.abi.name;
			this.endpoints = this.abi.endpoints?.length || 0;
			this.types = Object.keys(this.abi.types).length || 0;
		}
	}

	submit(): void {
		this.dialogRef.submit({
			name: this.smartContractName,
			content: this.abi,
			projectId: this.dialogRef.data.projectId,
		});
	}
}
