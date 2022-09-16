import { Component, Input, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../../project/store/project.action';
import { Observable, of } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit {
	@Input() address: string = '';

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() selectedSc?: ProjectScAbi | null;

	code$: Observable<string> = of('');

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.code$ = this.store.select(ProjectSelector.getScCode(this.address));

		this.store.dispatch(ProjectAction.loadScCode({address: this.address}));
	}
}
