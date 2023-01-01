import { Action, createReducer, on } from '@ngrx/store';
import { SecurityAction } from './security.action';

export interface ISecurityState {
	passwordHash: string;
	isPasswordSet: boolean;
}

const initialState: ISecurityState = {
	passwordHash: '',
	isPasswordSet: false,
};

export const reducer = createReducer(
	initialState,
	on(SecurityAction.putPasswordSuccess, (state, { encodedPassword }) => ({
		...state,
		passwordHash: encodedPassword,
	})),
	on(SecurityAction.setPasswordSuccess, (state, { encodedPassword }) => ({
		...state,
		isPasswordSet: true,
		passwordHash: encodedPassword,
	})),
	on(SecurityAction.loadSecurityStateSuccess, (state, { isPasswordSet }) => ({
		...state,
		isPasswordSet,
	})),
	on(SecurityAction.clearPasswordHash, (state) => ({
		...state,
		passwordHash: '',
	})),
);


export function securityReducer(state: ISecurityState | undefined, action: Action): ISecurityState {
	return reducer(state, action);
}
