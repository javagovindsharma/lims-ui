import axios from "axios";
import { UserUtils } from "../../lib/authenticationUtils";
import { commonError } from "../common/commonError";

import store from "../../store";
import { AssetManager, User } from "../../types/User";
//const bonds:Array<any> =[];
export function getUserGroups(pageNumber: any, LogsPerPage: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_ASSET_MANAGER_PAGER;
  let payload: any = {
    customerId: customerId,
    size: LogsPerPage,
    page: pageNumber,
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "LOGS");
    });
}

export function getUsers(pageNumber: any, usersPerPage: any, assetMgr: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_USER_SEARCH_PAGER;
  let payload: any = {
    customerId: customerId,
    size: usersPerPage,
    page: pageNumber,
    assetMgr: assetMgr,
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "LOGS");
    });
}

export function UpdateUser(user: User) {
  var url = process.env.REACT_APP_USER_ACTIONS
    ? process.env.REACT_APP_USER_ACTIONS
    : "";
  var customerId = UserUtils.getUser()?.customerId;
  delete user.isSuperUser;
  user.customerId = Number(customerId);
  user.action = "UPDATE";
  return axios
    .post(
      url,
      user, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}

export function AddUser(user: User) {
  var url = process.env.REACT_APP_USER_ACTIONS
    ? process.env.REACT_APP_USER_ACTIONS
    : "";
  var customerId = UserUtils.getUser()?.customerId;
  delete user.isSuperUser;
  user.customerId = Number(customerId);
  user.action = "ADD";
  return axios
    .post(
      url,
      user, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}

export function DeleteUser(user: User) {
  var url = process.env.REACT_APP_USER_ACTIONS
    ? process.env.REACT_APP_USER_ACTIONS
    : "";
  var customerId = UserUtils.getUser()?.customerId;
  delete user.isSuperUser;
  user.customerId = Number(customerId);
  user.action = "DELETE";
  return axios
    .post(
      url,
      user, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}

export function AddAssetManager(assetManager: AssetManager) {
  var url = process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    ? process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    : "";
  var customerId = UserUtils.getUser()?.customerId;
  assetManager.customerId = Number(customerId);
  assetManager.action = "ADD";
  return axios
    .post(
      url,
      assetManager, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}
export function DeleteAssetManager(assetManager: AssetManager) {
  var url = process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    ? process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    : "";
  assetManager.action = "DELETE";
  var customerId = UserUtils.getUser()?.customerId;
  assetManager.customerId = Number(customerId);
  return axios
    .post(
      url,
      assetManager, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}
export function UpdateAssetManager(assetManager: AssetManager) {
  var url = process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    ? process.env.REACT_APP_ASSET_MANAGER_ACTIONS
    : "";
  assetManager.action = "UPDATE";
  var customerId = UserUtils.getUser()?.customerId;
  assetManager.customerId = Number(customerId);
  return axios
    .post(
      url,
      assetManager, // this is the object sent to Katarina service
      {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}
export function resendUserEmail(email: string) {
  var url = process.env.REACT_APP_USER_VERIFICATION_RESEND;
  let payload: any = {
    email: email,
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}
