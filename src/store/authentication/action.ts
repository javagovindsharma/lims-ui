import { Dispatch } from "redux";
import { AuthActionTypes } from "./types";
import { AuthUtils } from "../../lib/authenticationUtils";
import { User, initialUser } from "../../types/Iuser";

export const login = (userName: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOADING });
    if ((userName === "demo1" || userName === "demo") && password === "demo") {
      // A dummy user to enter the system until the backend service is ready
      AuthUtils.setAuthData(
        "user.data.dummy_token",
        getUserDetails(userName, password)
      );

      dispatch({ type: AuthActionTypes.LOGIN, payload: "demoCompany" });
      dispatch({
        type: AuthActionTypes.IDPLOGIN,
        payload: "gjzKWHG2nrdMwz9hJlgJlA==",
      });
    }
  };
};

function getUserDetails(userName: string, password: string): User {
    let user: User = initialUser;
    return user;
}


