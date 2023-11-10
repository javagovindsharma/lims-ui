import React, { useReducer, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import key from "../../assets/img/key.png";
import trade from "../../assets/img/trade.png";
import { AppState } from "../../store";
import "bootstrap/dist/css/bootstrap.css";
import { login } from "../../store/authentication/action";

type State = {
  username: string;
  password: string;
  isButtonDisabled: boolean;
  helperText: string;
  isError: boolean;
};

const initialState: State = {
  username: "",
  password: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false,
};

type Action =
  | { type: "setUsername"; payload: string }
  | { type: "setPassword"; payload: string }
  | { type: "setIsButtonDisabled"; payload: boolean }
  | { type: "loginSuccess"; payload: void }
  | { type: "loginFailed"; payload: string }
  | { type: "setIsError"; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload,
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload,
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload,
      };
    case "loginSuccess":
      return {
        ...state,
        isError: false,
      };
    case "loginFailed":
      return {
        ...state,
        helperText: action.payload,
        isError: true,
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload,
      };
    default:
      return state;
  }
};

export default function Login() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, dispatchLogin] = useReducer(reducer, initialState);

  const { data, loading, error, sessionId } = useSelector(
    (state: AppState) => state.auth
  );

  useEffect(() => {
    if (data) {
      history("/");
    }
  }, [data, history]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(login(username, password));
    console.log(username, password);
    history("/home1");
  };

  const Error = () => {
    return state.isError ? (
      <div className="alert alert-danger text-center" role="alert">
        {state.helperText}
      </div>
    ) : null;
  };

  return (
    <div className="container mt-5">
      <div className="card login-card border rounded">
        <div className="row no-gutters">
          <div className="col-md-5">
            <img src={key} alt="login" className="login-card-img ml-3 mt-3" />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <div className="brand-wrapper">
                <img
                  src={trade}
                  alt="logo"
                  className="logo ml-3"
                  style={{ width: "80%" }}
                />
              </div>
              <p className="login-card-description">Sign into your account</p>

              <form onSubmit={handleSubmit}>
                <Error />

                <div className="form-group mb-3">
                  <div className="input-group input-group-merge input-group-alternative">
                    <input
                      name="username"
                      className="form-control"
                      value={username}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <div className="input-group input-group-merge input-group-alternative">
                    <input
                      name="password"
                      className="form-control"
                      value={password}
                      placeholder="Password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
