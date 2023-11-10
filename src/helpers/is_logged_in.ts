import axios from "axios";
import {  Relation } from "../types/Iuser";
import store from "../store";
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
      console.log("error ")
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
      console.log("error ")
    });
}
