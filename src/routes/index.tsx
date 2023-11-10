import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./RouteUtils";
import { CustomRoutes } from "./RouteTypes";
import Error from "../component/homepage/Error";
import Home from "../component/homepage/Home";
import Login from "../component/homepage/Login";
import MainLayout from "../component/common/MainLayout";
import Home1 from "../component/homepage/Home1";

export default () => {
  return (
    <Router>
      <Routes>
        <Route path={CustomRoutes.DEFAULT.path} element={<Login />} />
        <Route path={CustomRoutes.ERROR.path} element={<Error />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/employe"
          element={<PrivateRoute element={<MainPage />} />}
        />
        <Route path="/home1" element={<PublicRoute element={<Home1 />} />} />
      </Routes>
    </Router>
  );
};

function MainPage() {
  return (
    <React.Fragment>
      <MainLayout>
        <Routes>
          <Route path={CustomRoutes.DEFAULT.path} element={<Home />} />
          <Route path={CustomRoutes.LOGIN.path} element={<Login />} />
          <Route element={<Error />} />
        </Routes>
      </MainLayout>
    </React.Fragment>
  );
}
