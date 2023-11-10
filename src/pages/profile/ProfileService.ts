import axios from "axios";
import { commonError } from "../common/commonError";
import store from "../../store";

export default function getProfile(email: any) {
   var url = process.env.REACT_APP_FIND_BY_USER_DETAILS
      ? process.env.REACT_APP_FIND_BY_USER_DETAILS
      : "";
   return axios
      .get(url + "?" + "email=" + email, {
         headers: {
            Authorization: "Bearer " + store.getState().auth.sessionId,
         },
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         commonError(err.response.status, "PROFILE");
      });
}

export function saveProfileData(payLoad: any) {
   var url: any = process.env.REACT_APP_SUBMIT_UPDATE_USER_DATA;
   return axios
      .post(url, payLoad, {
         headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + store.getState().auth.sessionId,
         },
      })
      .then((res) => {
         return res;
      })
      .catch((err) => {
         return err.response;
      });
}