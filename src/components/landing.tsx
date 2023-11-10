import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./homepage/home";
import Login from "./Login";

const isLoggedIn = true;

const Landing = () => (
  <div className="app-routes">
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/" component={Home} />
    </Switch>
  </div>
);

export default Landing;
