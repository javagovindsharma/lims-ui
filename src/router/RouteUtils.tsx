import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { UserUtils } from "../lib/authenticationUtils";
import { AppState } from "../store";

//from https://www.cluemediator.com/login-app-create-login-form-in-reactjs-using-secure-rest-api

// handle the private routes
export function PrivateRoute({ component: Component, ...rest }: any) {
  const auth = useSelector((state: AppState) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.data ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

// handle the public routes
export function PublicRoute({ component: Component, ...rest }: any) {
  const auth = useSelector((state: AppState) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth.data ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
}

export function AdminRoute({ component: Component, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        UserUtils.getUser()?.isSuperUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
}
