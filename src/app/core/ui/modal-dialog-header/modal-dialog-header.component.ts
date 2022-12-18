import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-modal-dialog-header',
	templateUrl: './modal-dialog-header.component.html',
	styleUrls: ['./modal-dialog-header.component.scss']
})
export class ModalDialogHeaderComponent implements OnInit {
	@Input() title = 'Title';

	@Input() dialogRef!: MatDialogRef<any>;

	constructor() {
	}

	ngOnInit(): void {
	}

}
