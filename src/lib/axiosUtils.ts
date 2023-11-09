import axios from "axios";

import { TokenUtils } from "./authenticationUtils";
import { AuthActionTypes } from "../store/authentication/types";
import store from "../store";

export function addInterceptorForToken() {
  axios.interceptors.request.use(function (config) {
    const token = TokenUtils.getToken();
    if (token) {
      const tokenHeader = `Bearer ${token}`;
      config.headers.Authorization = tokenHeader;
    }

    return config;
  });
}

enum ErrorStatus {
  UNAUTHORIZED = 401,
  NOTFOUND = 404,
  INTERNALSERVERERROR = 500,
}

export const configErrorHandler = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      if (status === ErrorStatus.UNAUTHORIZED) {
        store.dispatch({ type: AuthActionTypes.LOGOUT });
      }
      return Promise.reject(error);
    }
  );
};
