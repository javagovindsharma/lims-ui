import axios from "axios";
import { UserUtils } from "../../lib/authenticationUtils";

import store from "../../store";
import { commonError } from "./commonError";
export function getAssetManagers() {
  var AssetManagers: Array<any> = [];
  var customerId = UserUtils.getUser()?.customerId;
  // var url = process.env.REACT_APP_FIND_BY_TYPE;
  var url = process.env.REACT_APP_LOAD_ASSET_MANAGERS_UPLOAD_PAGE;
  let payload: any = { customerId: customerId };
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
      commonError(err.response.status, "COMMONSERVICE");
    });
}
