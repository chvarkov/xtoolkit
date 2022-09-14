import { Component, OnInit } from '@angular/core';
import { AbstractModalDialog } from '../../../../core/ui/dialog/abstract-modal-dialog';
import { DialogRef } from '../../../../core/ui/dialog/dialog-ref';
import { IScAbi } from '../../../../core/elrond/interfaces/sc-abi';
import { ProjectScAbi } from '../../../../core/data-provider/data-provider';

export interface IUploadedSc extends Omit<ProjectScAbi, 'id'> {
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

	abi: IScAbi = {
		name: '',
		constructor: {
			inputs: [],
			outputs: [],
		},
		types: {},
		endpoints: [],
	};

	dialogRef!: DialogRef<void, IUploadedSc>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.dialogRef.options.width = '300px';
		this.dialogRef.options.height = '160px';
	}

	async onFileSelected(event: any) {
		const file: File = event.target.files[0];

		if (file) {
			this.dialogRef.options.height = '260px';
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
			abi: this.abi,
		});
	}
}
