import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthActionTypes } from "../../store/authentication/types";
import { AuthUtils } from "../../lib/authenticationUtils";

export const SSOPostLogout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    AuthUtils.clearAuthData();
    dispatch({ type: AuthActionTypes.LOGOUT });
    history.push("/login");
  });

  return <h1>SuccessFull !</h1>;
};
