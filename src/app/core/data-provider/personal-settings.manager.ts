import { Observable } from 'rxjs';
import { ProjectComponentType } from '../types';

export const PERSONAL_SETTINGS_MANAGER = 'CORE:PERSONAL_SETTINGS_MANAGER';

export const SELF_PROJECT_ID = 'self';

export enum Theme {
	Dark = 'dark',
	Light = 'light',
}

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
	theme: Theme,
	leftPanelWidth: number;
	rightPanelWidth: number;
}

export interface ProjectExplorerExpandState {
	project: boolean;
	abi: boolean;
	sc: boolean;
	nft: boolean;
	token: boolean;
	wallet: boolean;
}

export interface PersonalSettingsManager {
	getActiveProjectOpenedTabs(): Observable<TabsData>;

	openTab(title: string,
			componentType: ProjectComponentType,
			componentId: string): Observable<TabsData>;

	pushTabAsFirst(index: number): Observable<TabsData>;

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

	getProjectExplorerState(projectId: string): Observable<ProjectExplorerExpandState>;

	updateProjectExplorerTree(projectId: string,
							  update: Partial<ProjectExplorerExpandState>): Observable<ProjectExplorerExpandState>;

	toggleTheme(): Observable<LayoutState>;
}

export function getUpdateExplorerStatePayload(type: ProjectComponentType, isExpanded: boolean): Partial<ProjectExplorerExpandState> {
	switch (type) {
		case 'project':
			return {project: isExpanded};
		case 'sc':
			return {sc: isExpanded};
		case 'abi':
			return {abi: isExpanded};
		case 'token':
			return {token: isExpanded};
		case 'wallet':
			return {wallet: isExpanded};
		case 'nft':
			return {nft: isExpanded};
		default:
			return {};
	}
}

export function reverseTheme(theme: Theme): Theme {
	return theme === Theme.Dark ? Theme.Light : Theme.Dark;
}

export const DEFAULT_PROJECT_EXPLORER_STATE: ProjectExplorerExpandState = {
	project: true,
	abi: true,
	sc: true,
	token: true,
	nft: true,
	wallet: true,
};
