/* eslint-disable jsx-a11y/anchor-is-valid */
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from "react";
import { ButtonGroup, Dropdown, DropdownButton, Navbar } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import { timeZones } from "../../helpers/constants";
import { UserUtils } from "../../lib/authenticationUtils";
import { CustomRoutes } from "../../router/RouteTypes";
import store, { AppState } from "../../store";
import { logout } from "../../store/authentication/actions";

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }
  a,
  .navbar-nav,
  .navbar-light .nav-link {
    color: white;
    &:hover {
      color: white;
    }
  }
  .user {
    &:hover {
      color: black !important;
    }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #ffa500;
    &:hover {
      color: white;
    }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
  .active {
    font-weight: bold;
  }
  .nav-bottom {
    border-bottom: 10px solid orange;
  }
`;
// move the above css to a centrtal file

export default function UserNavigationBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(logout(auth.sessionId));
  };
  const [showDropDown, setShowDropDown] = useState(false);
  const [userDropDown, setUserDropDown] = useState(false);

  if (!auth.data) {
    history.push("/login");
  }

  const SelectCompanies = () => {
    return auth.sessionId !== "Default" &&
      !auth.sessionId.startsWith("error") ? (
      <li className="nav-item dropdown mt-1">
        <a
          className="dropdown-toggle"
          id="navbarDropdownMenuLink"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span>Change Client</span>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <span className="nav-link user">Nordea Bank</span>
          <span className="nav-link user">SwedBank</span>
          <span className="nav-link user">Bank of America</span>
        </div>
      </li>
    ) : (
      <></>
    );
  };

  const MyProfile = () => {
    return auth.sessionId !== "Default" &&
       !auth.sessionId.startsWith("error") ? (
       <a href="/profile" target={"_blank"} rel="noreferrer">
          <span className="nav-link user">My Profile</span>
       </a>
    ) : (
       <></>
    );
  };
  return (
     <Styles>
        <Navbar className="px-2 nav-bottom" expand="lg">
           <Navbar.Brand
              onClick={() => {
                 history.push(CustomRoutes.DEFAULT.path);
              }}
           >
              LIMS{" "}
           </Navbar.Brand>

           <ul className="nav nav-tabs">
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/alltxns">
                       All Transactions
                    </NavLink>
                 </span>
              </li>{" "}
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/history">
                       History
                    </NavLink>
                 </span>
              </li>{" "}
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/upload">
                       All Upload
                    </NavLink>
                 </span>
              </li>{" "}
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/bonds">
                       Bond
                    </NavLink>
                 </span>
              </li>{" "}
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/equity">
                       Equity
                    </NavLink>
                 </span>
              </li>{" "}
              <li className="nav-item">
                 <span className="nav-link">
                    <NavLink className="nav-item" to="/future">
                       Future
                    </NavLink>
                 </span>
              </li>{" "}
           </ul>
           <ul className="nav nav-tabs">
              <li className="nav-item dropdown mt-1">
                 <a
                    className="dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="false"
                    aria-expanded="false"
                 >
                    <svg
                       xmlns="http://www.w3.org/2000/svg"
                       width="16"
                       height="16"
                       fill="currentColor"
                       className="bi bi-person"
                       viewBox="0 0 16 16"
                    >
                       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                    <span>
                       {" "}
                       {UserUtils.getUser()?.userDisplayName ?? "Please Logout"}
                    </span>
                 </a>
                 <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                 >
                    <span className="nav-link user">
                       AssetManger:{" "}
                       {UserUtils.getUser()?.assetManager ?? "Please Logout"}
                    </span>
                    <span className="nav-link user">
                       Email: {UserUtils.getUser()?.emailId ?? "Please Logout"}
                    </span>
                    <MyProfile />

                    <span
                       className="nav-link user"
                       role="button"
                       onClick={handleLogout}
                    >
                       Log Out
                    </span>
                 </div>
              </li>
           </ul>
        </Navbar>
     </Styles>
  );
}

/*
  <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form>
*/
