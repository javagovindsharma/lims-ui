/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AdminNavigationBar from "./AdminNavigation";
import UserNavigationBar from "./UserNavigation";
import { CustomRoutes } from "../../router/RouteTypes";

// move the above css to a centrtal file

export default function NavigationBar() {
  const history = useHistory();

  const auth = useSelector((state: AppState) => state.auth);

  if (!auth.data) {
    history.push("/login");
  }

  const location = useLocation();
  return location.pathname.includes(CustomRoutes.ADMIN.path) ? (
    <AdminNavigationBar />
  ) : (
    <UserNavigationBar />
  );
}

/*
  <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form>
*/
