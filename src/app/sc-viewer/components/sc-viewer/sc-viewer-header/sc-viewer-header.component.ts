import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../../project/store/project.action';
import { ProjectScAbi } from '../../../../core/data-provider/data-provider';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-sc-viewer-header',
	templateUrl: './sc-viewer-header.component.html',
	styleUrls: ['./sc-viewer-header.component.scss']
})
export class ScViewerHeaderComponent implements OnInit, OnDestroy {
	@Input() sc!: ProjectScAbi;

	addressControl = new FormControl();

	sub = new Subscription();

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.addressControl.setValue(this.sc?.address || '');

		this.sub.add(this.addressControl.valueChanges.pipe(
			debounceTime(200),
		).subscribe((address) => this.store.dispatch(ProjectAction.setScAddress({scId: this.sc?.id, address}))));
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
