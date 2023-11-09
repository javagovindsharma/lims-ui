import { AuthActionTypes, AuthState } from "./types";
import { Reducer } from "redux";

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
  sessionId: "Default",
  userSetting: { timeZone: "Asia/Kolkata", allTransactionColumn: [] },
};

export const reducer: Reducer<AuthState> = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case AuthActionTypes.LOGOUT:
      return {
        data: null,
        loading: false,
        error: null,
        sessionId: "Default",
        userSetting: { timeZone: "", allTransactionColumn: [] },
      };
    case AuthActionTypes.LOADING:
      return { ...state, loading: true, error: null };
    case AuthActionTypes.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        sessionId: "Default",
      };
    case AuthActionTypes.IDPLOGIN:
      return {
        ...state,
        loading: false,
        error: null,
        sessionId: action.payload,
      };
    case AuthActionTypes.IDPLOGOUT:
      return {
        ...state,
        loading: true,
        data: action.payload,
      };
    case AuthActionTypes.TIMEZONECHANGE:
      return {
        ...state,
        userSetting: { timeZone: action.payload, allTransactionColumn: [] },
      };
    default:
      return state;
  }
};

export default reducer;
