import { Component, Input, OnInit } from '@angular/core';
import { SelectElement } from '../../../core/ui/select/select.component';
import { Store } from '@ngrx/store';
import { ProjectAction } from '../../store/project.action';
import { Project } from '../../../core/data-provider/data-provider';
import { INetworkEnvironment } from '../../../core/interfaces/network-environment';

@Component({
	selector: 'app-project-selector',
	templateUrl: './project-selector.component.html',
	styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
	@Input() projects: Project[] = [];
	@Input() selected?: Project | null;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	createProject(): void {
		this.store.dispatch(ProjectAction.createProject());
	}

	mapElement(item: Project | undefined): SelectElement<Project> | undefined {
		if (!item) {
			return undefined;
		}

		return {
			name: item.name,
			value: item,
		};
	}
}
