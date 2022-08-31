import { DialogRef } from './dialog-ref';

export abstract class AbstractModalDialog<I = any, O = any> {
	dialogRef!: DialogRef<I, O>;
}
