import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProjectSelector } from '../store/project.selector';
import { map } from 'rxjs/operators';
import { ProjectComponentType } from '../../core/types';

@Pipe({
	name: 'isActiveProjectElement',
})
export class IsActiveProjectElementPipe implements PipeTransform {
	constructor(private readonly store: Store) {
	}

	transform(id: string, projectId: string, componentType: ProjectComponentType): Observable<boolean> {
		return this.store.select(ProjectSelector.activeTab).pipe(
			map(tab => {
				if (!tab) {
					return false;
				}

				return tab.componentId === id && tab.projectId === tab.projectId && tab.componentType === componentType;
			}),
		);
	}
}
