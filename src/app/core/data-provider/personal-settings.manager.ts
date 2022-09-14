import { Observable } from 'rxjs';
import { ProjectComponentType } from '../types';

export const PERSONAL_SETTINGS_MANAGER = 'CORE:PERSONAL_SETTINGS_MANAGER';

export interface OpenedProjectTab {
	index: number;
	title: string;
	componentType: ProjectComponentType;
	componentId: string;
}

export interface PersonalSettingsManager {
	getOpenedTabs(): Observable<OpenedProjectTab[]>;

	openTab(title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<OpenedProjectTab[]>;

	closeTab(index: number): Observable<OpenedProjectTab[]>;

	moveTab(prevIndex: number, currentIndex: number): Observable<OpenedProjectTab[]>;
}
