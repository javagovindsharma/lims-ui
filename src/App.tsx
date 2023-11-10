import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Routers from "../src/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faSearch,
  faShareAlt,
  faLink,
  faChevronDown,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faUser,
  faCog,
  faEye,
  faCopy,
  faEdit,
  faArrowLeft,
  faExternalLinkAlt,
  faPlusCircle,
  faMinusCircle,
  faCheck,
  faSort,
  faUsers,
  faHome,
  faTachometerAlt,
  faAngleRight,
  faExpandAlt,
  faArrowCircleRight,
  faArrowCircleLeft,
  faDownload,
  faThumbtack,
  faClock,
  faRedo,
  faBell,
  faFileUpload,
  faList,
  faSortUp,
  faSortDown,
  faTh,
  faTasks,
  faFileAlt,
  faArchive,
  faCalendarAlt,
  faDatabase,
  faChartLine,
  faLifeRing,
  faSignOutAlt,
  faCheckCircle,
  faTimesCircle,
  faLock,
  faClipboardList,
  faEllipsisV,
  faKey,
  faPencilAlt,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppState } from "./store";
import { logout } from "./store/authentication/actions";

config.autoAddCss = false;

library.add(
  faCheckSquare,
  faSearch,
  faShareAlt,
  faLink,
  faChevronDown,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faUser,
  faCog,
  faEye,
  faCopy,
  faEdit,
  faArrowLeft,
  faExternalLinkAlt,
  faPlusCircle,
  faMinusCircle,
  faCheck,
  faSort,
  faUsers,
  faHome,
  faTachometerAlt,
  faAngleRight,
  faExpandAlt,
  faArrowCircleRight,
  faArrowCircleLeft,
  faDownload,
  faThumbtack,
  faClock,
  faRedo,
  faBell,
  faFileUpload,
  faList,
  faSortUp,
  faSortDown,
  faTh,
  faTasks,
  faFileAlt,
  faArchive,
  faCalendarAlt,
  faDatabase,
  faChartLine,
  faLifeRing,
  faSignOutAlt,
  faCheckCircle,
  faTimesCircle,
  faLock,
  faClipboardList,
  faEllipsisV,
  faKey,
  faPencilAlt,
  faPaperclip
);

const App: React.FC = () => {
  const auth = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();

  axios.interceptors.request.use(
    (req) => {
      // Add configurations here
      return req;
    },
    (err) => {
      if (err.response.data === "You are not authorized") {
        alert("You are not authorized to access this service.");
      }
      if (
        err.response.status === 403 &&
        err.response.data !== "You are not authorized"
      ) {
        alert("Your session may have expired. Please login again");
        dispatch(logout(auth.sessionId));
      }
      return Promise.reject(err);
    }
  );

  // For POST requests
  axios.interceptors.response.use(
    (res) => {
      // Add configurations here
      return res;
    },
    (err) => {
      if (err.response.data === "You are not authorized") {
        console.log("You are not authorized to access this service.");
      }
      if (
        err.response.status === 403 &&
        err.response.data !== "You are not authorized"
      ) {
        console.log("Your session may have expired. Please login again");
        dispatch(logout(auth.sessionId));
      }
      return Promise.reject(err);
    }
  );

  return <Routers />;
};

export default App;
//check
