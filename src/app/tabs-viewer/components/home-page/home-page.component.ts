import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProjectInfo } from '../../../core/data-provider/data-provider';
import { ProjectSelector } from '../../../project/store/project.selector';
import { ProjectAction } from '../../../project/store/project.action';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
	projectList$: Observable<ProjectInfo[]>;

	constructor(private readonly store: Store) {
		this.projectList$ = this.store.select(ProjectSelector.projectList)
	}

	ngOnInit(): void {
	}

	openProject(id: string): void {
		this.store.dispatch(ProjectAction.openProject({id}));
	}
}
