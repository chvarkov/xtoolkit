import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-modal-dialog',
	templateUrl: './modal-dialog.component.html',
	styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {
	@Input() title = 'Title';

	@Input() showActions = true;

	@Input() dialogRef!: MatDialogRef<any>;

	@Input() width: string | number = '300px'

	@Input() height: string | number = '300px'
}
