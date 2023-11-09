import { useSelector } from "react-redux";
import { AppState } from "../store";
import { Navigate, Route } from "react-router-dom";
import { UserUtils } from "../lib/authenticationUtils";
import React from "react";

interface PrivateRouteProps {
  element: React.ReactNode;
  // Add other props as needed
}

export function PrivateRoute({ element, ...rest }: PrivateRouteProps) {
  const isAuthenticated = useSelector((state: AppState) => state.auth);
  return isAuthenticated ? (
    <React.Fragment>{element}</React.Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
}


export function PublicRoute({ element, ...rest }: PrivateRouteProps) {
  return <React.Fragment>{element}</React.Fragment>
}

export function PublicRoute1({ element, ...rest }: PrivateRouteProps) {
  const isAuthenticated = useSelector((state: AppState) => state.auth);
  return !isAuthenticated ? (
    <React.Fragment>{element}</React.Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function AdminRoute({ element, ...rest }: any) {
  const auth = useSelector((state: AppState) => state.auth);
  return (
    <Route
      {...rest}
      render={(props: any) =>
        UserUtils.getUser()?.isSuperUser ? (
          <Route element={element} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
}
