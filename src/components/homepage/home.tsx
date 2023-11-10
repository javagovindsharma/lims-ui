import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import "../../css/main.css";
import {
  allowedEvents
} from "../../helpers/constants";
import { AppState } from "../../store";
import { logout } from "../../store/authentication/actions";
import Footer from "../common/Footer";

const Home = () => {
  const mystyle = {
    whiteSpace: "pre-wrap",
    padding: "10px",
  } as React.CSSProperties;

  const auth = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();

  var timer: any = null;
  var minutes = process.env.REACT_APP_INACTIVITY_MINUTES
    ? parseInt(process.env.REACT_APP_INACTIVITY_MINUTES)
    : 10;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setTimeout(async () => {
      allowedEvents.forEach((ev) => {
        window.removeEventListener(ev, resetInactivity);
      });
      await alert("You are being logged out due to inactivity");
      dispatch(logout(auth.sessionId));
    }, minutes * 60 * 1000);
    allowedEvents.forEach((ev) => {
      window.addEventListener(ev, resetInactivity);
    });
    // ReportSearch();
  }, []);

  const resetInactivity = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      allowedEvents.forEach((ev) => {
        window.removeEventListener(ev, resetInactivity);
      });

      await alert("You are being logged out due to inactivity");
      dispatch(logout(auth.sessionId));
    }, minutes * 60 * 1000);
  };

  return (
    <div className="wrapper">
      <h1>Welcome CSS LIMS </h1>User Dashboard
      <hr />
      
      <Footer />
    </div>
  );
};

export default Home;
