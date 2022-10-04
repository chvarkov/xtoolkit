import { Action, createReducer, on } from '@ngrx/store';
import { LayoutAction } from './layout.action';
import { LayoutState } from '../../core/data-provider/personal-settings.manager';

export interface IAppLayoutState extends LayoutState {
	isLoadingScreenVisible: boolean;
}

const initialState: IAppLayoutState = {
	isLoadingScreenVisible: true,
	rightPanelWidth: 450,
	leftPanelWidth: 450,
};

export const reducer = createReducer(
	initialState,
	on(LayoutAction.toggleLoadingScreen, (state, { visible }) => {
		return {
			...state,
			isLoadingScreenVisible: visible,
		};
	}),
	on(LayoutAction.loadLayoutStateSuccess, (state, { leftPanelWidth, rightPanelWidth }) => {
		return {
			...state,
			leftPanelWidth,
			rightPanelWidth,
		};
	}),
	on(LayoutAction.setLayoutState, (state, { layoutState }) => {
		return {
			...state,
			...layoutState,
		};
	}),
);

export function layoutReducer(state: IAppLayoutState | undefined, action: Action): IAppLayoutState {
	return reducer(state, action);
}
