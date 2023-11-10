import axios from "axios";
import { operationTypes, transactionTypes } from "../../helpers/constants";
import { UserUtils } from "../../lib/authenticationUtils";
import { transactionObjectConverter } from "../../lib/transactionUtils";
import EquityManualTransaction from "./EquityManualTransaction";
import store from "../../store";
import { commonError } from "../common/commonError";
//const Equities:Array<any> =[];
export default function getEquity(
  pageNumber: any,
  ReportsPerPage: any,
  sortBy: string,
  direction: string
) {
  var assetManager = UserUtils.getUser()?.assetManager;
  var customerId = UserUtils.getUser()?.customerId;
  var transactionType = transactionTypes.EQUITY;
  var url = process.env.REACT_APP_FIND_BY_TYPE;
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
      commonError(err.response.status, "EQUITYSERVICE");
    });
}

export function submitEquityData(equityObject: EquityManualTransaction) {
  //a function to hit api for submitting manual equity -- by Deepansh
  const equityBackend = transactionObjectConverter(
    equityObject,
    operationTypes.CREATE,
    "EQUITY"
  );
  var url: any = process.env.REACT_APP_SUBMIT_MANUAL_TRANSACTION;

  return axios
    .post(
      url,
      equityBackend, // this is the object sent to Katarina service
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
