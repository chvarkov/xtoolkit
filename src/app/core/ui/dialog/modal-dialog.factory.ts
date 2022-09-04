import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, Type } from '@angular/core';
import { AbstractModalDialog } from './abstract-modal-dialog';
import { DialogRef } from './dialog-ref';

export interface DialogOptions {
	width: string;
	height: string;
}

@Injectable({
	providedIn: 'root'
})
export class ModalDialogFactory {
	constructor(private componentFactoryResolver: ComponentFactoryResolver,
				private appRef: ApplicationRef,
				private injector: Injector) {
	}

	show<T, D>(component: Type<T>, data?: D, options?: DialogOptions): DialogRef<D> {
		const componentRef = this.componentFactoryResolver
			.resolveComponentFactory(component)
			.create(this.injector);

		const instance = componentRef.instance;

		if (!(instance instanceof AbstractModalDialog)) {
			throw new Error(`Component "${component.name}" must be extends ${AbstractModalDialog.name}`);
		}

		instance.dialogRef = new DialogRef(data, options);

		instance.dialogRef.after$().subscribe(() => componentRef.destroy());

		this.appRef.attachView(componentRef.hostView);

		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

		document.body.appendChild(domElem);

		return instance.dialogRef;
	}
}
