import axios from "axios";
import { Dispatch } from "redux";
import { getUser } from "../../helpers/is_logged_in";
import { AuthUtils } from "../../lib/authenticationUtils";
import {
   iHUBUser,
   initialiHUBUser,
   initialUser,
   MemberOfAssetMgrGroup,
   SuperuserOfCustomer,
   User,
} from "../../types/Iuser";
import { AuthActionTypes } from "./types";
import store from "../../store";

// TODO: Properly check for all cases.
export const login = (
   userName: string,
   password: string,
   sessionId: string,
   customerId?: string,
   customerName?: string
) => {
   return async function (dispatch: Dispatch) {
      dispatch({ type: AuthActionTypes.LOADING });

      // A dummy user to enter system till backend service is ready
      AuthUtils.setAuthData(
         "user.data.dummy_token",
         getUserDetails(userName, password, customerId)
      );

      dispatch({ type: AuthActionTypes.LOGIN, payload: "demoCompany" });
      dispatch({
         type: AuthActionTypes.IDPLOGIN,
         payload: "gjzKWHG2nrdMwz9hJlgJlA==",
      });
   };
};

/**Nothing to really pass in as it will use the token to get necessary info */
export const logout = (sessionId: string) => {
   return async function (dispatch: Dispatch) {
      const backend_enabled = false;
      axios.post("/account/logout").then((res) => {
         AuthUtils.clearAuthData();
         dispatch({ type: AuthActionTypes.LOGOUT });
      });
   };
};

function getUserDetails(
   userName: string,
   password: string,
   customer?: string
): User {
   //a axios call for getting login details from backend service
   //hardcoded values set for making values available all thru application
   let user: User = initialUser;
   user = {
      userDisplayName: "demo",
      assetManager: "",
      customerId: "104",
      emailId: "demo@demo.com",
      isSuperUser: true,
   };
   return user;
}

export const saveSession = (sessionID: String) => {
   return function (dispatch: Dispatch) {
      dispatch({ type: AuthActionTypes.LOADING });
      dispatch({ type: AuthActionTypes.IDPLOGIN, payload: sessionID });
   };
};
