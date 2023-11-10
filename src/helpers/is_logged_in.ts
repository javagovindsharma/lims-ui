import axios from "axios";
import { iHUBUser, Relation } from "../types/Iuser";
import store from "../store";
import { commonError } from "../pages/common/commonError";
export default function getCustomers(email: string) {
  var customers: Array<Relation> = [];
  //var email = "katarina.stubberud@cssregtech.com";
  // // var url=process.env.REACT_APP_FIND_BY_TYPE ? process.env.REACT_APP_FIND_BY_TYPE:'';
  var url = process.env.REACT_APP_USER_GROUP_SERVICE + "getMembershipsByEmail";
  let payload: any = { email: email };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      customers = res.data.Relations;
      return customers;
    })
    .catch((err) => {
      commonError(err.response.status, "ISLOGIN");
    });
}

export function getUser(email: string) {
  var user: iHUBUser;
  //var email = "katarina.stubberud@cssregtech.com";
  // var url=process.env.REACT_APP_FIND_BY_TYPE ? process.env.REACT_APP_FIND_BY_TYPE:'';
  var url = process.env.REACT_APP_USER_GROUP_SERVICE + "findByEmail";
  let payload: any = { email: email };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      user = res.data;
      return user;
    })
    .catch((err) => {
      commonError(err.response.status, "ISLOGIN");
    });
}

export function getUserSettings() {
  var url = process.env.REACT_APP_USER_GROUP_SERVICE + "getUserSetting";
  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "GETTINGUSERSETTING");
    });
}
