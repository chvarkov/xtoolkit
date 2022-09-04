import { merge, Observable, Subject, zip } from 'rxjs';
import { DialogOptions } from './modal-dialog.factory';

export class DialogRef<I = any, O = any> {
	private submitSubject = new Subject<O>();
	private closeSubject = new Subject<void>();

	constructor(readonly data: I,
				readonly options: DialogOptions = {width: '400px', height: '260px'}) {
	}

	submit(data: O): void {
		this.submitSubject.next(data);
		this.submitSubject.complete();
	}

	close(): void {
		this.closeSubject.next();
		this.closeSubject.complete();
	}

	afterSubmit$(): Observable<O> {
		return this.submitSubject.asObservable();
	}

	afterClose$(): Observable<void> {
		return this.closeSubject.asObservable();
	}

	after$(): Observable<O | void> {
		return merge(
			this.afterSubmit$(),
			this.afterClose$(),
		);
	}
}
