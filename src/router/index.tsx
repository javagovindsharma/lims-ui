import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainLayout from "../components/common/MainLayout";
import Home from "../components/homepage/home";
import Login from "../components/Login";
import { SSOError } from "../components/SSOLanding/ssoError";
import { SSOPostLogout } from "../components/SSOLanding/ssoPostLogout";
import { SSOSuccess } from "../components/SSOLanding/ssoSuccess";
import AllTransactions from "../pages/AllTransactions/AllTransactions";
import Equity from "../pages/Equity/Equity";
import EquityManualTransaction from "../pages/Equity/EquityManualTransaction";
import { CustomRoutes } from "./RouteTypes";
import { AdminRoute, PrivateRoute, PublicRoute } from "./RouteUtils";
import AdminTool from "../pages/Administration/AdminTool";
import { NoMatch } from "../pages/error/noMatch";
import { UnderConstruction } from "../pages/error/UnderConstruction";
import Deposits from "../pages/Deposit/Deposits";
import Profile from "../pages/profile/Profile";
import Users from "../pages/Users/Users";
import EmployeeMaster from "../pages/Employee/EmployeeMaster";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PrivateRoute component={MainPage} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
};

function MainPage() {
  return (
     <React.Fragment>
        <MainLayout>
           <Switch>
              <Route
                 exact
                 path={CustomRoutes.DEFAULT.path}
                 component={Home}
              ></Route>

              {/**  Admin Route  */}
              <AdminRoute
                 path={CustomRoutes.EMPLOYEE.path}
                 component={EmployeeMaster}
              ></AdminRoute>

              {/** common for all */}
              <Route
                 exact
                 path="/underconstruction/:page"
                 component={UnderConstruction}
              />
              <Route component={NoMatch}></Route>
           </Switch>
        </MainLayout>
     </React.Fragment>
  );
}
