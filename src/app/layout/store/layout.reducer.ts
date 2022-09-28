import { Action, createReducer, on } from '@ngrx/store';
import { LayoutAction } from './layout.action';

export interface ILayoutState {
	isLoadingScreenVisible: boolean;
}

const initialState: ILayoutState = {
	isLoadingScreenVisible: true,
};

export const reducer = createReducer(
	initialState,
	on(LayoutAction.toggleLoadingScreen, (state, { visible }) => {
		return {
			...state,
			isLoadingScreenVisible: visible,
		};
	}),
);


export function layoutReducer(state: ILayoutState | undefined, action: Action): ILayoutState {
	return reducer(state, action);
}
