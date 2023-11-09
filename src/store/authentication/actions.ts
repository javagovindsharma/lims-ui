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
    if (
      sessionId === "Default" &&
      (userName === "demo1" || userName === "demo") &&
      password === "demo"
    ) {
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
    } else if (sessionId !== "Default") {
      //idp login case
      let user: User = initialUser;
      var iHUBUser: iHUBUser = initialiHUBUser;
      getUser(userName).then((res) => {
        iHUBUser = res ? res : initialiHUBUser;
        user.customerId = customerId;
        user.emailId = iHUBUser.email;
        user.userDisplayName = iHUBUser.firstname;
        iHUBUser.superuserOfCustomers.forEach(
          (superUser: SuperuserOfCustomer) => {
            if (superUser.id === Number(customerId)) {
              user.isSuperUser = true;
            }
          }
        );
        iHUBUser.memberOfAssetMgrGroups.forEach(
          (assetManager: MemberOfAssetMgrGroup) => {
            if (assetManager.customer_id === Number(customerId)) {
              user.assetManager = assetManager.shortname;
            }
          }
        );

        updateLoginTimeStamp(user.emailId, sessionId).then((res) => {
          AuthUtils.setAuthData("user.data.dummy_token", user);
          dispatch({ type: AuthActionTypes.LOGIN, payload: customerName });
        });
      });
    } else {
      //idp login case
      let user: User = initialUser;
      iHUBUser = initialiHUBUser;
      getUser(userName).then((res) => {
        iHUBUser = res ? res : initialiHUBUser;
        user.customerId = customerId;
        user.emailId = iHUBUser.email;
        user.userDisplayName = iHUBUser.firstname;
        iHUBUser.superuserOfCustomers.forEach(
          (superUser: SuperuserOfCustomer) => {
            if (superUser.id === Number(customerId)) {
              user.isSuperUser = true;
            }
          }
        );
        iHUBUser.memberOfAssetMgrGroups.forEach(
          (assetManager: MemberOfAssetMgrGroup) => {
            if (assetManager.customer_id === Number(customerId)) {
              user.assetManager = assetManager.shortname;
            }
          }
        );
        updateLoginTimeStamp(user.emailId, sessionId).then((res) => {
          AuthUtils.setAuthData("user.data.dummy_token", user);
          dispatch({ type: AuthActionTypes.LOGIN, payload: customerName });
        });
      });
    }
  };
};

/**Nothing to really pass in as it will use the token to get necessary info */
export const logout = (sessionId: string) => {
  return async function (dispatch: Dispatch) {
    const backend_enabled = false;
    if (!backend_enabled) {
      if (sessionId !== "Default" && !sessionId.startsWith("error")) {
        var idToken = getIDTokenforLogout(sessionId);
        //error in getting idToken
        if ((await idToken) === "204 NO_CONTENT") {
          dispatch({ type: AuthActionTypes.LOGOUT });
        } else {
          var idpUrl = createIdpLogoutUrl(await idToken);
          window.location.href = idpUrl;
          dispatch({ type: AuthActionTypes.IDPLOGOUT, payload: "res.data" });
        }
      } else if (sessionId === "Default") {
        AuthUtils.clearAuthData();
        dispatch({ type: AuthActionTypes.LOGOUT });
      }
    } else
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
  if (userName === "demo1") {
    user = {
      userDisplayName: "demo1",
      assetManager: "SEB",
      customerId: "102",
      emailId: "demo1@email.com",
    };
  } else if (userName === "demo") {
    user = {
      userDisplayName: "demo",
      assetManager: "",
      customerId: "104",
      emailId: "demo@demo.com",
      isSuperUser: true,
    };
  } else {
    var iHUBUser: iHUBUser = initialiHUBUser;
    getUser(userName).then((res) => {
      iHUBUser = res ? res : initialiHUBUser;
      user.customerId = customer;
      user.emailId = iHUBUser.email;
      user.userDisplayName = iHUBUser.firstname;
      iHUBUser.superuserOfCustomers.forEach(
        (superUser: SuperuserOfCustomer) => {
          if (superUser.id === Number(customer)) {
            user.isSuperUser = true;
          }
          iHUBUser.memberOfAssetMgrGroups.forEach(
            (assetManager: MemberOfAssetMgrGroup) => {
              if (assetManager.customer_id === Number(customer)) {
                user.assetManager = assetManager.shortname;
              }
            }
          );
        }
      );
      AuthUtils.setAuthData(iHUBUser.email, user);
    });
  }

  return user;
}

export const saveSession = (sessionID: String) => {
  return function (dispatch: Dispatch) {
    dispatch({ type: AuthActionTypes.LOADING });
    dispatch({ type: AuthActionTypes.IDPLOGIN, payload: sessionID });
  };
};

async function getIDTokenforLogout(sessionID: string) {
  var url = process.env.REACT_APP_LOGOUT_IDP
    ? process.env.REACT_APP_LOGOUT_IDP
    : "";
  let payload: any = { sessionId: sessionID };
  const params: any = new URLSearchParams(payload);

  const response = await axios.post(url, params);
  const data = await response.data;
  return data;
}

function createIdpLogoutUrl(idToken: string) {
  return (
    process.env.REACT_APP_IDP_END_SESSION_URI +
    "post_logout_redirect_uri=" +
    process.env.REACT_APP_IDP_POST_LOGOUT_REDIRECT_URI +
    "&id_token_hint=" +
    idToken
  );
}

export const setTimeZone = (timeZone: string) => {
  var url = process.env.REACT_APP_USER_GROUP_SERVICE + "saveUserSetting";
  var settingObject = {
    ...store.getState().auth.userSetting,
    timeZone: timeZone,
  };
  axios
    .post(url, settingObject, {
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => console.debug(res))
    .catch((err) => {});
  return async function (dispatch: Dispatch) {
    dispatch({ type: AuthActionTypes.TIMEZONECHANGE, payload: timeZone });
  };
};

export const setTimeZoneOnLogin = (timeZone: string) => {
  return async function (dispatch: Dispatch) {
    dispatch({ type: AuthActionTypes.TIMEZONECHANGE, payload: timeZone });
  };
};

async function updateLoginTimeStamp(email: string, sessionId: string) {
  var URL = process.env.REACT_APP_SAVE_USER_LOGIN
    ? process.env.REACT_APP_SAVE_USER_LOGIN
    : "";
  var axios = require("axios");

  var config = {
    method: "put",
    url: URL + "?email=" + email,
    headers: {
      Authorization: "Bearer " + sessionId,
    },
  };

  axios(config)
    .then(function (response: any) {
      return response.data;
    })
    .catch(function (error: any) {
      return error;
    });
}
