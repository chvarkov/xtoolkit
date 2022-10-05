import { Observable } from 'rxjs';
import { ProjectComponentType } from '../types';
import { Project } from './data-provider';

export const PERSONAL_SETTINGS_MANAGER = 'CORE:PERSONAL_SETTINGS_MANAGER';

export const SELF_PROJECT_ID = 'self';

export interface OpenedProjectTab {
	index: number;
	title: string;
	componentType: ProjectComponentType;
	componentId: string;
	projectId: string;
}

export interface TabsData {
	tabs: OpenedProjectTab[];
	selectedIndex?: number;
}

export interface LayoutState {
	leftPanelWidth: number;
	rightPanelWidth: number;
}

export interface ProjectExplorerNode {
	id: string;
	isOpen: boolean;
	parentId?: string;
	childrenIds: string[],
}

export interface ProjectExplorerState {
	explorerNodeMap: {[id: string]: ProjectExplorerNode};
}

export interface PersonalSettingsManager {
	getOpenedTabs(): Observable<TabsData>;

	openTab(projectId: string,
			title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData>;

	rename(projectId: string,
		   componentType: ProjectComponentType,
		   componentId: string,
		   newName: string): Observable<TabsData>;

	deleteComponent(projectId: string, componentType: ProjectComponentType, componentId: string): Observable<TabsData>;

	closeTab(index: number): Observable<TabsData>;

	moveTab(prevIndex: number, currentIndex: number): Observable<TabsData>;

	selectTab(index: number): Observable<TabsData>;

	getLayoutState(): Observable<LayoutState>;

	setLayoutState(partialState: Partial<LayoutState>): Observable<LayoutState>;

	getProjectExplorerState(): Observable<ProjectExplorerState>;

	updateProjectExplorerTree(id: string,
							  isOpen: boolean,
							  withParents: boolean,
							  withChildren: boolean): Observable<ProjectExplorerState>;

	syncProjectExplorerTree(projects: Project[]): Observable<ProjectExplorerState>;
}

export function getProjectComponentNodeId(projectId: string, type: ProjectComponentType, componentId: string): string {
	return [projectId, type, componentId].join(':');
}
