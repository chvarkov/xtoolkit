import { createSelector } from '@ngrx/store';
import { LAYOUT_FEATURE } from '../constants';
import { IAppLayoutState } from './layout.reducer';

export class LayoutSelector {
	static isLoadingScreenVisible = createSelector(
		(app: Record<string, any>) => app[LAYOUT_FEATURE],
		(state: IAppLayoutState) => state.isLoadingScreenVisible,
	);

	static panelsWidth = createSelector(
		(app: Record<string, any>) => app[LAYOUT_FEATURE],
		(state: IAppLayoutState) => ({left: state.leftPanelWidth, right: state.rightPanelWidth}),
	);
}
