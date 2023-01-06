import { Action, createReducer, on } from '@ngrx/store';
import { NewsAction } from './news.action';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';
import { Post, ReleaseInfo } from '../../core/data-provider/api.client';

export interface INewsState {
	news: Post[];
	releases: ReleaseInfo[];
}

const initialState: INewsState = {
	news: [],
	releases: [],
};

export const reducer = createReducer(
	initialState,
	on(NewsAction.loadNewsSuccess, (state, { list }) => {
		return {
			...state,
			news: list,
		};
	}),
	on(NewsAction.loadReleasesSuccess, (state, { list }) => {
		return {
			...state,
			releases: list,
		};
	}),
	...NewsAction.errorActions.map((action): ReducerTypes<INewsState, any> => on(action, (state, { err, type }): INewsState => {
		console.error(`Action: ${type}`, err);

		return state as any;
	}))
);


export function newsReducer(state: INewsState | undefined, action: Action): INewsState {
	return reducer(state, action);
}
