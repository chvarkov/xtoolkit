import { createAction, props } from '@ngrx/store';
import { Post } from '../../core/data-provider/api.client';

export class NewsAction {
	static readonly loadNews = createAction(`[${NewsAction.name}] load news [...]`);
	static readonly loadNewsSuccess = createAction(`[${NewsAction.name}] load news [OK]`, props<{list: Post[]}>());
	static readonly loadNewsError = createAction(`[${NewsAction.name}] load news [ERR]`, props<{err: Error}>());

	static readonly errorActions = [
		NewsAction.loadNewsError,
	];
}
