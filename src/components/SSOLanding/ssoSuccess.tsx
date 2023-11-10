import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveSession } from "../../store/authentication/actions";
export const SSOSuccess = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    // Update the document title using the browser API
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const sessionId = params.get("sessionId");
    dispatch(saveSession(sessionId ? decodeURI(sessionId) : "Default"));
    history.push("/login");
  });

  return <h1>SuccessFull !</h1>;
};
