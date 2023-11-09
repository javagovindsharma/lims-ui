// actions/authActions.ts

import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducer/index'; // Replace with your actual root reducer path
import AuthService from '../services/AuthService';

// Action Types
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const AuthActions = {
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
};
// Action Creators
interface LoginUserAction {
  type: typeof LOGIN_USER;
  payload: {
    username: string;
  };
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export type AuthAction = LoginUserAction;


// Async Action Creator (Thunk Action)
export const loginUser = (
  username: string,
  password: string
): ThunkAction<void, RootState, unknown, AuthAction> => async (dispatch) => {
  try {
    const isAuthenticated = await AuthService.login(username, password);

    if (isAuthenticated) {
      dispatch({
        type: LOGIN_USER,
        payload: {
          username,
        },
      });
    } else {
      console.error('Authentication failed');
    }
  } catch (error) {
    console.error('Error during authentication', error);
  }
};