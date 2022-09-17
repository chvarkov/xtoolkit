import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../../project/store/project.action';
import { ProjectScAbi } from '../../../../core/data-provider/data-provider';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'app-sc-viewer-header',
	templateUrl: './sc-viewer-header.component.html',
	styleUrls: ['./sc-viewer-header.component.scss']
})
export class ScViewerHeaderComponent implements OnInit, OnDestroy {
	@Input() sc!: ProjectScAbi;
	@Input() address: string = '';

	addressChangesSubject = new Subject<string>();

	sub = new Subscription();

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.sub.add(this.addressChangesSubject.pipe(
			debounceTime(100),
		).subscribe((address) => {
			if (!this.sc) {
				return;
			}

			this.store.dispatch(ProjectAction.setScAddress({
				scId: this.sc.id,
				address,
			}));
		}));
	}

	onChangeAddress(event: Event): void {
		const value = (<HTMLInputElement>(event.target)).value;

		this.addressChangesSubject.next(value);
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
