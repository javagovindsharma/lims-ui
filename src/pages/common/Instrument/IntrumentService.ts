import axios from "axios";
import { UserUtils } from "../../../lib/authenticationUtils";
import store from "../../../store";
import { commonError } from "../commonError";
export function searchInstruments(
  key: string,
  instrumentType: string,
  assetManager: string
) {
  var Instrument: Array<any> = [];

  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_INSTRUMENT_SEARCH;
  let payload: any = {
    customerId: customerId,
    assetMgr: assetManager,
    key: key,
    transactionType: instrumentType === "CFD" ? "EQUITY" : instrumentType,
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
      commonError(err.response.status, "INSTRUMENTSERVICE");
    });
}
