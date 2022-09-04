import { Component, Input } from '@angular/core';
import { DialogRef } from '../dialog-ref';

@Component({
	selector: 'app-modal-dialog',
	templateUrl: './modal-dialog.component.html',
	styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {
	@Input() title = 'Title';

	@Input() showActions = true;

	@Input() dialogRef!: DialogRef;
}
