/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Navbar } from "react-bootstrap";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { logout } from "../../store/authentication/actions";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { CustomRoutes } from "../../router/RouteTypes";

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

export default function AdminNavigationBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(logout(auth.sessionId));
  };

  if (!auth.data) {
    history.push("/login");
  }

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
              <NavLink
                className="nav-item"
                to={CustomRoutes.EMPLOYEE.path}
              >
                Employe Master
              </NavLink>
            </span>
          </li>{" "}
          
        </ul>
      </Navbar>
    </Styles>
  );
}
