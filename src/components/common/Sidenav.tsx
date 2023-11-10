import React, { useState } from "react";
import { Col, Collapse, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { timeZones } from "../../helpers/constants";
import { UserUtils } from "../../lib/authenticationUtils";
import { CustomRoutes } from "../../router/RouteTypes";
import store, { AppState } from "../../store";
import { logout } from "../../store/authentication/actions";
import {
  adminMenuListItems,
  menuListItems,
  menuListItemTypes,
  superUserMenuListItems,
} from "./Common";

const Sidenav = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const [visible, setVisible] = useState(false);
  const [expand, setExpand] = useState(false);
  const [profileExpand, setProfileExpand] = useState(false);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(logout(auth.sessionId));
  };

  const leftMenuClasses =
    "navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white";

  const toogleSidenav = () => {
    if (visible) {
      document.body.classList.remove("g-sidenav-pinned");
      setVisible(false);
    } else {
      document.body.classList.add("g-sidenav-pinned");
      setVisible(true);
    }
  };

  const labelVisibility = () => {
    return visible ? "d-none" : "";
  };

  const MyProfile = () => {
    return auth.sessionId !== "Default" &&
      !auth.sessionId.startsWith("error") ? (
      <a
        href="/profile"
       rel="noreferrer"
      >
        <span
          className="nav-link user"
          style={{
            paddingBottom: "0px",
            paddingTop: "3px",
            fontFamily: "poppins",
            fontSize: "0.75rem",
            paddingLeft: "15px",
            color: "black",
          }}
        >
          My Profile
        </span>
      </a>
    ) : (
      <></>
    );
  };

  const renderMenuItems = () => {
    return (
      <ul className="navbar-nav">
        {UserUtils.getUser()?.isSuperUser &&
          superUserMenuListItems.map((icons: menuListItemTypes) => {
            return (
              <li className="nav-item" key={icons.dataId}>
                <NavLink exact to={icons.linkPath} className="nav-link">
                  <i className={icons.icon}></i>
                  <span className="nav-link-text ml-1">{icons.text}</span>
                </NavLink>
              </li>
            );
          })}
        {UserUtils.getUser()?.isSuperUser === false ||
          (UserUtils.getUser()?.isSuperUser === undefined &&
            menuListItems.map((icons: menuListItemTypes) => {
              return (
                <li className="nav-item" key={icons.dataId}>
                  <NavLink exact to={icons.linkPath} className="nav-link">
                    <i className={icons.icon}></i>
                    <span className="nav-link-text ml-1">{icons.text}</span>
                  </NavLink>
                </li>
              );
            }))}

        <li
          className="nav-item"
          onClick={() => {
            if (visible) {
              setProfileExpand(!profileExpand);
            } else {
              setVisible(true);
            }
          }}
        >
          <div className="nav-link" style={{ cursor: "pointer" }}>
            <i className="fas fa-user"></i>
            <span className="nav-link-text ml-1">
              {" "}
              {UserUtils.getUser()?.userDisplayName ?? "Please Logout"}
              {"         "}
              <i
                className={
                  profileExpand
                    ? "fas fa-caret-down fa-rotate-180"
                    : "fas fa-caret-down"
                }
                style={{
                  right: "0",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                  minWidth: "0px",
                }}
              ></i>
            </span>
          </div>
        </li>
        <Collapse in={profileExpand} className="nav-item">
          <div
            style={{
              backgroundColor: "rgb(253, 227, 167)",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              AssetManger:{" "}
              {UserUtils.getUser()?.assetManager ?? "Please Logout"}
            </span>
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              Email:<br></br> {UserUtils.getUser()?.emailId ?? "Please Logout"}
            </span>
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                cursor: "pointer",
                paddingLeft: "15px",
              }}
              onClick={() => setExpand(!expand)}
            >
              User Setting{" "}
              <i
                className={
                  expand
                    ? "fas fa-caret-down fa-rotate-180"
                    : "fas fa-caret-down"
                }
                style={{
                  right: "0",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                  minWidth: "0px",
                }}
              ></i>
            </span>
            <MyProfile />
            <span
              className="nav-link user"
              role="button"
              onClick={handleLogout}
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              Log Out
            </span>
          </div>
        </Collapse>
      </ul>
    );
  };

  const renderAdminMenu = () => {
    return (
      <ul className="navbar-nav">
        {adminMenuListItems.map((icons: menuListItemTypes) => {
          return (
            <li className="nav-item" key={icons.dataId}>
              <NavLink exact to={icons.linkPath} className="nav-link">
                <i className={icons.icon}></i>
                <span className="nav-link-text ml-1">{icons.text}</span>
              </NavLink>
              <ReactTooltip
                id={icons.dataId}
                place="right"
                effect="solid"
                className={labelVisibility()}
              />
            </li>
          );
        })}

        <li
          className="nav-item"
          onClick={() => {
            if (visible) {
              setProfileExpand(!profileExpand);
            } else {
              setVisible(true);
            }
          }}
        >
          <div className="nav-link" style={{ cursor: "pointer" }}>
            <i className="fas fa-user"></i>
            <span className="nav-link-text ml-1">
              {" "}
              {UserUtils.getUser()?.userDisplayName ?? "Please Logout"}
              {"         "}
              <i
                className={
                  profileExpand
                    ? "fas fa-caret-down fa-rotate-180"
                    : "fas fa-caret-down"
                }
                style={{
                  right: "0",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                  minWidth: "0px",
                }}
              ></i>
            </span>
          </div>
        </li>
        <Collapse in={profileExpand} className="nav-item">
          <div>
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              AssetManger: <br></br>
              {UserUtils.getUser()?.assetManager ?? "Please Logout"}
            </span>
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              Email: <br />
              {UserUtils.getUser()?.emailId ?? "Please Logout"}
            </span>
            <span
              className="nav-link user"
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                cursor: "pointer",
                paddingLeft: "15px",
              }}
              onClick={() => setExpand(!expand)}
            >
              User Setting{" "}
              <i
                className={
                  expand
                    ? "fas fa-caret-down fa-rotate-180"
                    : "fas fa-caret-down"
                }
                style={{
                  right: "0",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                  minWidth: "0px",
                }}
              ></i>
            </span>
            <MyProfile />

            <span
              className="nav-link user"
              role="button"
              onClick={handleLogout}
              style={{
                paddingBottom: "0px",
                paddingTop: "3px",
                fontFamily: "poppins",
                fontSize: "0.75rem",
                paddingLeft: "15px",
              }}
            >
              Log Out
            </span>
          </div>
        </Collapse>
      </ul>
    );
  };

  return (
    <nav
      className={
        visible
          ? `leftmainmenu sidenav ${leftMenuClasses}`
          : `closeLeftMainMenu ${leftMenuClasses}`
      }
      id="sidenav-main"
    >
      <div className="scrollbar-inner overflow-hidden">
        {/* Brand */}
        <div className="sidenav-header d-flex align-items-center">
          <div className={visible ? "navbar-brand d-block" : "d-none"}>
            LIMS
          </div>
          <div></div>
          <div className=" mx-auto p2 ">
            {/* Sidenav toggler */}
            <div
              className="sidenav-toggler d-none d-xl-block"
              data-action="sidenav-unpin"
              data-target="#sidenav-main"
              onClick={() => {
                toogleSidenav();
                setExpand(false);
                setProfileExpand(false);
              }}
            >
              <div className="sidenav-toggler-inner">
                {!visible && (
                  <>
                    {" "}
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                  </>
                )}
                {visible && <i className="fas fa-times fa-2x"></i>}
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-inner">
          {/* Collapse */}
          <div className="collapse navbar-collapse" id="sidenav-collapse-main">
            {/* Nav items */}

            {location.pathname.includes(CustomRoutes.ADMIN.path)
              ? renderAdminMenu()
              : renderMenuItems()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidenav;
