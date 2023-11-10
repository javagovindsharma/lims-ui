import axios from "axios";
import { UserUtils } from "../../../lib/authenticationUtils";

import store from "../../../store";
import { commonError } from "../commonError";

export function searchCounterparty(key: string, assetManager: string) {
  var Counterparty: Array<any> = [];
  var customerId = UserUtils.getUser()?.customerId;
  var limit = 20; // to be decided later on
  var url = process.env.REACT_APP_COUNTERPARTY_SEARCH;
  let payload: any = {
    customerId: customerId,
    assetMgr: assetManager,
    limit: limit,
    key: key,
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
      commonError(err.response.status, "COUNTERPARTYSERVICE");
    });
}

//service to search for broker typeahead
export function searchBroker(key: string, assetManager: string) {
  var Broker: Array<any> = [];
  var customerId = UserUtils.getUser()?.customerId;
  var limit = 20; // to be decided later on
  var url = process.env.REACT_APP_BROKER_SEARCH;
  let payload: any = {
    customerId: customerId,
    assetMgr: assetManager,
    limit: limit,
    key: key,
  };
  const params = new URLSearchParams(payload);
  return (
    axios
      //   .get(url + "?" + params)
      .get(url + "?" + params, {
        headers: {
          Authorization: "Bearer " + store.getState().auth.sessionId,
        },
      })
      .then((res) => {
        Broker = res.data;
        return res.data;
      })
      .catch((err) => {})
  );
}
