import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ToastNoAnimation, ToastPackage, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LayoutSelector } from '../../../layout/store/layout.selector';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-toastr',
	templateUrl: './toastr.component.html',
	styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent extends ToastNoAnimation implements OnInit {
	private readonly margin = 12;

	containerWidth$: Observable<string>;

	get icon(): string {
		switch (this.toastPackage.toastType) {
			case 'toast-success':
				return 'task_alt';
			case 'toast-error':
				return 'error_outline';
			default:
				return '';
		}
	}

	constructor(toastrService: ToastrService,
				toastPackage: ToastPackage,
				appRef: ApplicationRef,
				private store: Store) {
		super(toastrService, toastPackage, appRef);

		this.containerWidth$ = this.store.select(LayoutSelector.panelsWidth).pipe(
			map(v => v.right - (this.margin * 2)),
			map(width => `${width}px`),
		);
	}

	ngOnInit(): void {

	}
}
