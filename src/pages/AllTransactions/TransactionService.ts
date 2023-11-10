import axios from "axios";
import { UserUtils } from "../../lib/authenticationUtils";
import {
  searchMap,
  transactionActionObject,
  transactionBackend,
} from "../../types/Transaction";
import store from "../../store";
import { frontendActionConverter } from "../../lib/transactionUtils";

//const Transaction:Array<any> =[];
export default function getTransactions(
  page: any,
  size: any,
  sortBy: string,
  direction: string
) {
  var Transaction: Array<any> = [];
  var assetManager = UserUtils.getUser()?.assetManager;
  var customerId = UserUtils.getUser()?.customerId;
  var url = process.env.REACT_APP_ALL_TRANSACTION
    ? process.env.REACT_APP_ALL_TRANSACTION
    : "";
  let payload: any = {
    customerId: customerId,
    assetMgr: assetManager,
    page: page,
    size: size,
    sortBy: sortBy,
    direction: direction,
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      Transaction = res.data;
      return res.data;
    })
    .catch((err) => {});
}

export function txnAction(
  transactionActionObject: transactionBackend[],
  action: string
) {
  var url = process.env.REACT_APP_TRANSACTION_ACTION
    ? process.env.REACT_APP_TRANSACTION_ACTION
    : "";
  var assetManager = UserUtils.getUser()?.assetManager;
  var customerId = UserUtils.getUser()?.customerId;
  let payload: any = { customerId: customerId, assetMgr: assetManager };
  const params: any = new URLSearchParams(payload);
  const headers = {
    Authorization: "Bearer " + store.getState().auth.sessionId,
    "Access-Control-Allow-Origin": "*",
  };
  var transactionObject = transactionActionObject.map((transaction: any) => {
    return frontendActionConverter(transaction, action);
  });
  return axios
    .put(url + "?" + params, transactionObject, {
      headers,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {});
}

export function searchTransaction(SearchMap: searchMap, size: any, page: any) {
  var url = process.env.REACT_APP_SEARCH_TRANSACTION;
  let payload: any = {
    page: page,
    size: size,
  };
  var data = JSON.stringify({
    ...SearchMap,
    customerId: UserUtils.getUser()?.customerId,
  });
  var config = {
    method: "POST",
    url: url + page + "&size=" + size,
    data: data,
  };

  const params: any = new URLSearchParams(payload);
  return axios
    .post(url + "?" + params, data, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {});
}
