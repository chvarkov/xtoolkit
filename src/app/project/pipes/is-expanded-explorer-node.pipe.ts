import { Pipe, PipeTransform } from '@angular/core';
import { ProjectComponentType } from '../../core/types';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getProjectComponentNodeId, ProjectExplorerNode } from '../../core/data-provider/personal-settings.manager';
import { map } from 'rxjs/operators';
import { ProjectSelector } from '../store/project.selector';

@Pipe({
	name: 'isExpandedExplorerNode',
})
export class IsExpandedExplorerNodePipe implements PipeTransform {
	private readonly projectExplorerMap$: Observable<{ [id: string]: ProjectExplorerNode }>;

	constructor(private readonly store: Store) {
		this.projectExplorerMap$ = this.store.select(ProjectSelector.projectExplorerNodeMap);
	}

	transform(projectId: string, type: ProjectComponentType, componentId: string): Observable<boolean> {
		const id = getProjectComponentNodeId(projectId, type, componentId);
		return this.projectExplorerMap$.pipe(
			map((map) => {
				if (!map || !map[id]) {
					return true;
				}

				return map[id].isExpanded;
			}),
		);
	}
}
