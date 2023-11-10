import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { saveSession } from "../../store/authentication/actions";
import { useDispatch } from "react-redux";
export const SSOError = () => {
  let history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    // Update the document title using the browser API
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const error = params.get("error");
    dispatch(saveSession("error:" + error));
    history.push("/login");
  });

  return <h1>h12</h1>;
};
