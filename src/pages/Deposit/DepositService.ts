import axios from "axios";
import { operationTypes, transactionTypes } from "../../helpers/constants";
import { UserUtils } from "../../lib/authenticationUtils";
import { depositTransactionObjectConverter } from "../../lib/transactionUtils";
import DepositManualTransaction from "./DepositManualTransaction";
import { commonError } from "../common/commonError";

import store from "../../store";
//const Deposits:Array<any> =[];
export default function getDeposits(
  pageNumber: any,
  ReportsPerPage: any,
  sortBy: string,
  direction: string
) {
  var assetManager = UserUtils.getUser()?.assetManager;
  var customerId = UserUtils.getUser()?.customerId;
  var transactionType = transactionTypes.DEPOSIT;
  var url = process.env.REACT_APP_FIND_BY_TYPE
    ? process.env.REACT_APP_FIND_BY_TYPE
    : "";
  let payload: any = {
    customerId: customerId,
    assetMgr: assetManager,
    type: transactionType,
    size: ReportsPerPage,
    page: pageNumber,
    sortBy: sortBy,
    direction: direction,
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
      commonError(err.response.status, "DEPOSIT");
    });
}
export function submitDepositData(DespositObject: DepositManualTransaction) {
  //a function to hit api for submitting manual Bond -- by Govind
  const BondBackend = depositTransactionObjectConverter(
    DespositObject,
    operationTypes.CREATE,
    transactionTypes.DEPOSIT
  );
  var url: any = process.env.REACT_APP_SUBMIT_MANUAL_TRANSACTION;

  return axios
    .post(
      url,
      BondBackend, // this is the object sent to Katarina service
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
