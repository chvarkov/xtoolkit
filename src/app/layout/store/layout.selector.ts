import { createSelector } from '@ngrx/store';
import { LAYOUT_FEATURE } from '../constants';
import { ILayoutState } from './layout.reducer';

export class LayoutSelector {
	static isLoadingScreenVisible = createSelector(
		(app: Record<string, any>) => app[LAYOUT_FEATURE],
		(state: ILayoutState) => state.isLoadingScreenVisible,
	);
}
