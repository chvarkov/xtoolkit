import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectWallet } from '../../../core/data-provider/data-provider';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../store/project.action';

@Component({
	selector: 'app-active-project',
	templateUrl: './active-project.component.html',
	styleUrls: ['./active-project.component.scss']
})
export class ActiveProjectComponent implements OnInit {
	@Input() project!: Project;

	@Input() connectedWallet?: ProjectWallet;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	closeProject(): void {
		this.store.dispatch(ProjectAction.closeProject());
	}

	disconnectWallet(): void {
		this.store.dispatch(ProjectAction.logoutMaiarWallet());
	}
}
