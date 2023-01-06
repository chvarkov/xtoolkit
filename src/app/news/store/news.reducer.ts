import { Action, createReducer, on } from '@ngrx/store';
import { NewsAction } from './news.action';
import { ReducerTypes } from '@ngrx/store/src/reducer_creator';
import { Post } from '../../core/data-provider/api.client';

export interface INewsState {
	news: Post[];
}

const initialState: INewsState = {
	news: [],
};

export const reducer = createReducer(
	initialState,
	on(NewsAction.loadNewsSuccess, (state, { list }) => {
		return {
			...state,
			news: list,
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
