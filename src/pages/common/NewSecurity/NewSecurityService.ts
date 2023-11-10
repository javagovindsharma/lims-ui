import axios from "axios";
import store from "../../../store";
import { commonError } from "../commonError";

export function getSDRList(
  customerId: string | undefined,
  pageNumber: number,
  pageSize: number,
  direction: string
) {
  var url = process.env.REACT_APP_ADMIN_LOAD_SDR_LIST;
  let payload: any = {
    customerId: customerId,
    page: pageNumber,
    size: pageSize,
    status: direction,
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
      commonError(err.response.status, "SDRSERVICE");
    });
}

export function AddSDR(sdr: any) {
  var url = process.env.REACT_APP_SDR_CREATE
    ? process.env.REACT_APP_SDR_CREATE
    : "";

  return axios
    .post(url + "?customerId=" + sdr.customerId + "&isTrade=yes", sdr, {
      headers: {
        Authorization: "Bearer " + store.getState().auth.sessionId,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
}
