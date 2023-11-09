import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer } from "redux-persist";

import authReducer from "./authentication/reducer";

import { persistConfigAuth } from "./persistConfigs";

const rootReducer = combineReducers({
  auth: persistReducer(persistConfigAuth, authReducer),
});

export type AppState = ReturnType<typeof rootReducer>;

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);
