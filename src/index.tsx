import React from "react";
import ReactDOM from "react-dom";
//import './index.css';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./css/custom.scss";

//import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store";

declare global {
  interface Window {
    _env_: any;
  }
}

window._env_ = window._env_ || {};

const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
