/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import key from "../assets/img/key.png";
import trade from "../assets/img/trade.png";
import getCustomers, { getUserSettings } from "../helpers/is_logged_in";
import { SSOUtils } from "../lib/authenticationUtils";
import { commonError } from "../pages/common/commonError";
import { CustomRoutes } from "../router/RouteTypes";
import { AppState } from "../store";
import { login } from "../store/authentication/actions";
import { Relation } from "../types/Iuser";

//state type

type State = {
   username: string;
   password: string;
   isButtonDisabled: boolean;
   helperText: string;
   isError: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            //  helperText: action.payload,
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
   }
};

//const history = createBrowserHistory();
export default function Login() {
   let [customer, setcustomer] = useState("");
   const [customerName, setCustomerName] = useState("");
   let userName = useFormInput("");
   let password = useFormInput("");
   let history = useHistory();

   const dispatch = useDispatch();
   const { data, loading, error, sessionId } = useSelector(
      (state: AppState) => state.auth
   );
   if (data) {
      history.push("/");
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      dispatch(
         login(
            userName.value,
            password.value,
            sessionId,
            customer,
            customerName
         )
      );
   };
   // generic Alert component.
   const Error = () => {
      // eslint-disable-next-line react/no-danger-with-children
      return error ? (
         <div
            className="alert alert-danger text-center"
            role="alert"
            dangerouslySetInnerHTML={{ __html: error }}
         ></div>
      ) : (
         <></>
      );
   };

   const handleChange = (e: any) => {
      var values = e.target.value;

      setcustomer(values.substring(0, 3));
      setCustomerName(values.substring(4, values.length));
   };

   const SSOError = () => {
      return sessionId.startsWith("error") ? (
         <div
            className="alert alert-danger text-center"
            role="alert"
            dangerouslySetInnerHTML={{
               __html:
                  sessionId === "error:User not verified"
                     ? "User is not verified. Please check email or contact administrator to send a new verification email."
                     : sessionId === "error:User not registered"
                     ? "User is not registered in IHUB. Please contact administrator for further details."
                     : sessionId === "error:User not password changed"
                     ? "You need to reset your password. Please click forget password below to reset the password"
                     : "There is error in login through third party. Please retry or contact administrator",
            }}
         ></div>
      ) : (
         <></>
      );
   };

   const SSOSuccess = () => {
      return sessionId !== "Default" && !sessionId.startsWith("error") ? (
         <div
            className="alert alert-success text-center"
            role="alert"
            dangerouslySetInnerHTML={{
               __html:
                  "Login was successful, please select the client you want to login with .",
            }}
         ></div>
      ) : (
         <></>
      );
   };

   const FormButtons = () => {
      return (
         <div className="text-center mr-5">
            <button className="btn btn-primary my-4">Sign in</button>
            <button className="btn btn-primary my-4">Log In</button>
         </div>
      );
   };

   return (
      <div className="container">
         <div className="card login-card mt-6 border rounded">
            <div className="row no-gutters">
               <div className="col-md-5">
                  <img
                     src={key}
                     alt="login"
                     className="login-card-img ml-8 mt-7"
                  />
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
                     <p className="login-card-description ml-9">
                        Sign into your account
                     </p>

                     <div className="card-body px-lg-1 py-lg-1">
                        <form onSubmit={handleSubmit}>
                           <Error />
                           <SSOError />
                           <SSOSuccess />
                           {(sessionId === "Default" ||
                              sessionId.startsWith("error")) && (
                              <div
                                 className="form-group mb-3 col-xs-4"
                                 style={{
                                    display:
                                       process.env.REACT_APP_ENV !== "DEV"
                                          ? "none"
                                          : "",
                                 }}
                              >
                                 <div className="input-group input-group-merge input-group-alternative">
                                    <input
                                       name="userName"
                                       className="form-control"
                                       {...userName}
                                       placeholder="Username"
                                    />
                                 </div>
                              </div>
                           )}
                           {(sessionId === "Default" ||
                              sessionId.startsWith("error")) && (
                              <div
                                 className="form-group col-xs-4"
                                 style={{
                                    display:
                                       process.env.REACT_APP_ENV !== "DEV"
                                          ? "none"
                                          : "",
                                 }}
                              >
                                 <div className="input-group input-group-merge input-group-alternative">
                                    <input
                                       name="password"
                                       className="form-control"
                                       {...password}
                                       placeholder="Password"
                                       type="password"
                                    />
                                 </div>
                              </div>
                           )}
                           <div className="form-group mr-5">
                              {userName.customers.length > 0 &&
                                 password.value === "demo" && (
                                    <Form.Control
                                       style={{
                                          width: "max-content",
                                          borderBlockColor: "orange",
                                          marginLeft: "-28px",
                                       }}
                                       as="select"
                                       name="newassetMgrs"
                                       placeholder="Enter the full Name of the Group"
                                       id="newassetMgrs"
                                       key="newassetMgrs"
                                       onChange={handleChange}
                                    >
                                       <option value="" selected disabled>
                                          Select Client
                                       </option>
                                       {userName.customers.map(
                                          (data: Relation) => {
                                             return (
                                                <option
                                                   key={data.CustomerName}
                                                   value={
                                                      data.CustomerId +
                                                      "-" +
                                                      data.CustomerName
                                                   }
                                                >
                                                   {data.CustomerName}
                                                </option>
                                             );
                                          }
                                       )}
                                    </Form.Control>
                                 )}
                           </div>
                           <FormButtons />
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

//from https://www.cluemediator.com/login-app-create-login-form-in-reactjs-using-secure-rest-api
const useFormInput = (initialValue: string) => {
   let relations: Array<Relation> = [];
   const [value, setValue] = useState(initialValue);
   const [customers, setCustomers] = useState(relations);
   const handleChange = (e: any) => {
      if (e.target.name === "userName") {
         let reg_pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g;
         if (reg_pattern.test(e.target.value)) {
            getCustomers(e.target.value)
               .then((res) => {
                  const customersDataBackend = res ? res : [];
                  setCustomers(customersDataBackend);
               })
               .catch((err) => {
                  commonError(err.response.status, "LOGIN");
               });
         } else {
            setCustomers([]);
         }
      }
      setValue(e.target.value);
   };
   return {
      value,
      customers,
      onChange: handleChange,
   };
};
