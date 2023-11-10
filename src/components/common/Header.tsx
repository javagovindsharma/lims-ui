import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => (
  <div className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <a href="/" className="navbar-brand">
      FUND REPORTING
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav mr-auto">
        {/* <li className="nav-item"><NavLink exact className="nav-link" to="/">Dashboard</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/reporting">Reporting</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/filing">Filing</NavLink></li> */}
        <li className="nav-item">
          <NavLink exact className="nav-link" to="/question">
            Question
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/tasks">
            Tasks
          </NavLink>{" "}
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="."
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Settings
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <NavLink className="dropdown-item" to="/workflowconfiguration">
              Workfrlow Configuration
            </NavLink>
            <a className="dropdown-item" href="#">
              Another action
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </div>
        </li>
      </ul>
      <a
        className="btn btn-bd-download d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3"
        href="."
      >
        <FontAwesomeIcon icon="user" />
      </a>
    </div>
  </div>
);

export default Header;
