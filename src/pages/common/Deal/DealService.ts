import axios from "axios";
import { UserUtils } from "../../../lib/authenticationUtils";

import store from "../../../store";
import { commonError } from "../commonError";

export function getCurrencyCrosses() {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_CURRENCY_CROSS;
  let payload: any = { customerId: customerId };
  const params = new URLSearchParams(payload);
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
      commonError(err.response.status, "DEALSERVICE");
    });
}

export function getOTCInstrumentsCDS(transactionCode: any, key: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_OTC_INSTRUMENT + transactionCode;
  let payload: any = { customerId: customerId, key: key };
  const params = new URLSearchParams(payload);
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
      commonError(err.response.status, "DEALSERVICE");
    });
}

export function loadOtcCurrencies(isDaType: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_OTC_INSTRUMENT + "isda";
  let payload: any = { customerId: customerId, type: isDaType };
  const params = new URLSearchParams(payload);
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
      commonError(err.response.status, "DEALSERVICE");
    });
}
