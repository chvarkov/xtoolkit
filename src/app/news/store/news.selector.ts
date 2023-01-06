import { createSelector } from '@ngrx/store';
import { INewsState } from './news.reducer';
import { NEWS_FEATURE } from '../constants';

export class NewsSelector {
	static news = createSelector(
		(app: Record<string, any>) => app[NEWS_FEATURE],
		(state: INewsState) => state.news,
	);

	static releases = createSelector(
		(app: Record<string, any>) => app[NEWS_FEATURE],
		(state: INewsState) => state.releases,
	);
}
