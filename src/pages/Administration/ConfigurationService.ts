import axios from "axios";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import { Configuration } from "../../types/ImportCongurations";
import { commonError } from "../common/commonError";

export default function getConfiguration(
  configId: number,
  customerId: string | undefined
) {
  var url = process.env.REACT_APP_ADMIN_LOAD_CONFIGURATION
    ? process.env.REACT_APP_ADMIN_LOAD_CONFIGURATION
    : "";
  let payload: any = {
    configurationId: configId,
    customerId: customerId,
    assetMgr: "",
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CONFIGURATIONSERVICE");
    });
}

export function getAllConfiguration(customerId: string | undefined) {
  var Configurations: [Configuration];
  var url = process.env.REACT_APP_GET_IMPORT_CONFIG_LIST;
  let payload: any = { customerId: customerId, assetMgr: "" };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}

export function submitConfigurationData(
  ConfigurationObject: any,
  customerId: string | undefined
) {
  //a function to hit api for submitting manual Configuration -- by Deepansh
  var Configuration = ConfigurationObject;
  //var url: any = process.env.REACT_APP_SUBMIT_MANUAL_TRANSACTION;
  var url = process.env.REACT_APP_SAVE_IMPORT_CONFIG
    ? process.env.REACT_APP_SAVE_IMPORT_CONFIG + "?customerId=" + customerId
    : "";
  return axios
    .post(
      url,
      Configuration, // this is the object sent to Katarina service
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
      return err;
    });
}

export function getTransactionalFields() {
  var url = process.env.REACT_APP_GET_TRANSACTION_FIELDS;
  var transactionFields = [];
  var customerId = UserUtils.getUser()?.customerId;
  let payload: any = { customerId: customerId };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}

export function deleteConfiguration(
  id: number,
  customerId: string | undefined
) {
  var url = process.env.REACT_APP_DELETE_IMPORT_CONFIG;
  let payload: any = { configurationId: id, customerId: customerId };
  const params: any = new URLSearchParams(payload);
  return axios
    .delete(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}

export function getAllExportConfig(customerId: string | undefined) {
  var url = process.env.REACT_APP_GET_ALL_EXPORT_CONFIG;
  let payload: any = { customerId: customerId };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}

export function getAllTransactionTypes(customerId: string | undefined) {
  var url = process.env.REACT_APP_GET_TRANSACTION_TYPES;
  let payload: any = { customerId: customerId };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}

export function getAssetManagersByCustomerId(customerId: string | undefined) {
  var url = process.env.REACT_APP_GET_ASSETMANAGERS_BY_CUSTOMER_ID;
  let payload: any = { customerId: customerId };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CFD");
    });
}
export function getConfigurationList(
  customerId: string | undefined,
  pageNumber: number,
  pageSize: number,
  direction: string
) {
  var url = process.env.REACT_APP_ADMIN_LOAD_CONFIGURATION_LIST;
  let payload: any = {
    customerId: customerId,
    page: pageNumber,
    size: pageSize,
    direction: "ASC",
  };
  const params: any = new URLSearchParams(payload);
  return axios
    .get(url + "?" + params, {
      headers: { Authorization: "Bearer " + store.getState().auth.sessionId },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      commonError(err.response.status, "CONFIGURATIONSERVICE");
    });
}
