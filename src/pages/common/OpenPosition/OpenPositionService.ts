import axios from "axios";
import { UserUtils } from "../../../lib/authenticationUtils";

import store from "../../../store";
import { commonError } from "../commonError";

export function getOpenPositionInstrument() {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_OPEN_POSITION_INSTRUMENT;
  let payload: any = { customerId: customerId, iboxx: false };
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
    .catch((err) => {});
}

export function getUnderlyingSecurity(instrumentType: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_UNDERLYING_SECURITY;
  let payload: any = {
    customerId: customerId,
    currency: UserUtils.getUser()?.assetManager,
    instrumentType: instrumentType,
  };
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
      commonError(err.response.status, "TRSSERVICE");
    });
}

export function listOpenPosition(otcIntrument: any, assetManager: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_LIST_OPEN_POSITION;
  let payload: any = {
    customerId: customerId,
    otcInstrumentType: otcIntrument,
    assetMgr: assetManager,
  };
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
      commonError(err.response.status, "TRSSERVICE");
    });
}

export function fetchOpenPositionById(positionId: any) {
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_GET_FTECH_OPEN_POSITION_BY_ID;
  let payload: any = { customerId: customerId, positionId: positionId };
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
      commonError(err.response.status, "TRSSERVICE");
    });
}
