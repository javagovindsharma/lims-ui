import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import "../../css/main.css";
import store, { AppState } from "../../store";
import Footer from "../../components/common/Footer";
import { UserUtils } from "../../lib/authenticationUtils";
import getProfile, { saveProfileData } from "./ProfileService";
import { commonError } from "../common/commonError";
import { Alert, Button, Form, Table } from "react-bootstrap";
import Loading from "../../components/common/Loading";

export default class Profile extends React.Component {
   state = {
      //  given_name: "",
      //    family_name: "",
      Loading: false,
      isSubmitted: false,
      name: "",
      mfa: true,
      email: "",
      userId: "",
      userDetails: [],
      showAlert: false,
      alertMessage: "",
      btnDisabled: true,
      initialState: { name: "", mfa: true },
   };

   constructor(props: {}) {
      super(props);
      getProfile(UserUtils.getUser()?.emailId)
         .then((res) => {
            this.setState({
               //   given_name: res[0]["given_name"],
               //    family_name: res[0]["family_name"],
               name: res[0]["name"],
               mfa: res[0]["user_metadata"]["mfa_enabled"],
               email: res[0]["email"],
               userId: res[0]["user_id"],
               userDetails: res,
               initialState: {
                  name: res[0]["name"],
                  mfa: res[0]["user_metadata"]["mfa_enabled"],
               },
            });
         })
         .catch((err) => {
            commonError(err.response.status, "PROFILE");
         });
   }

   componentDidMount() {}

   handleChange = () => {
      this.setState({
         mfa: !this.state.mfa,
      });
   };

   saveData = () => {
      this.setState({ Loading: true });
      const payLoad = {
         //   given_name: this.state.given_name,
         //    family_name: this.state.family_name,
         name: this.state.name,
         mfa: this.state.mfa,
         email: this.state.email,
         user_id: this.state.userId,
      };
      saveProfileData(payLoad)
         .then((res) => {
            this.setState({ showAlert: true, alertMessage: res.data });
            this.setState({ Loading: false });
         })
         .catch((err) => {
            this.setState({ showAlert: true, alertMessage: err.response });
            commonError(err.response.status, "PROFILE");
            this.setState({ Loading: false });
         });
   };

   changeName = (event: { target: { name: any; value: any } }) => {
      if (event.target.name === "givenName") {
         this.setState({ given_name: event.target.value });
      } else if (event.target.name === "familyName") {
         this.setState({ family_name: event.target.value });
      } else if (event.target.name === "uName") {
         this.setState({
            name: event.target.value,
            btnDisabled: !this.state.btnDisabled,
         });
      }
   };

   render() {
      let SubmitLoading;
      if (this.state.Loading) {
         SubmitLoading = (
            <div
               className="modal modal-dialog-centered submit-loader"
               role="document"
            >
               <div className="modal-body">
                  <Loading></Loading>
               </div>
            </div>
         );
      } else {
         SubmitLoading = <></>;
      }
      return (
         <div className="wrapper">
            <h1>My Profile</h1>
            <hr />
            {this.state.showAlert && (
               <Alert
                  variant="success"
                  onClose={() =>
                     this.setState({ showAlert: false, alertMessage: "" })
                  }
                  dismissible
               >
                  {this.state.alertMessage}
               </Alert>
            )}
            <div className="GridWrapper">
               <fieldset className="scheduler-border">
                  <legend className="scheduler-border">My Details</legend>
                  <div>
                     <Table borderless={true}>
                        <tbody>
                           {/* <tr>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="securityIdentifier">
                                    Given Name:
                                 </Form.Label>
                              </td>
                              <td>
                                 <Form.Control
                                    size="sm"
                                    type="text"
                                    id="givenName"
                                    name="givenName"
                                    value={this.state.given_name}
                                    onChange={this.changeName}
                                 />
                              </td>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="securityIdentifier">
                                    Family Name:
                                 </Form.Label>
                              </td>
                              <td>
                                 <Form.Control
                                    size="sm"
                                    type="text"
                                    id="family name"
                                    name="familyName"
                                    value={this.state.family_name}
                                    onChange={this.changeName}
                                 />
                              </td>
                           </tr> */}
                           <tr>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="securityIdentifier">
                                    Name:
                                 </Form.Label>
                              </td>
                              <td>
                                 <Form.Control
                                    size="sm"
                                    type="text"
                                    id="uName"
                                    name="uName"
                                    value={this.state.name}
                                    onChange={this.changeName}
                                 />
                              </td>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="email">Email:</Form.Label>
                              </td>
                              <td>
                                 <Form.Control
                                    size="sm"
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={this.state.email}
                                    disabled
                                 />
                              </td>
                           </tr>
                        </tbody>
                     </Table>
                  </div>
               </fieldset>
            </div>
            {SubmitLoading}
            <div className="GridWrapper">
               <fieldset className="scheduler-border">
                  <legend className="scheduler-border">
                     Two Factor Authentication
                  </legend>
                  <div>
                     <Table borderless={true}>
                        <tbody>
                           <tr>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="mfa">MFA:</Form.Label>
                              </td>
                              <td>
                                 <Form.Control
                                    style={{
                                       minWidth: "-webkit-fill-available",
                                       width: "40%",
                                    }}
                                    size="sm"
                                    type="checkbox"
                                    checked={this.state.mfa}
                                    onClick={this.handleChange}
                                 />
                              </td>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="mfa"></Form.Label>
                              </td>
                              <td className="bondInstrumentTd">
                                 <Form.Label htmlFor="mfa"></Form.Label>
                              </td>
                           </tr>
                        </tbody>
                     </Table>
                  </div>
               </fieldset>
            </div>
            <div
               style={{
                  textAlign: "center",
               }}
            >
               <Button
                  type="button"
                  variant="outline-primary"
                  onClick={this.saveData}
                  disabled={
                     this.state.mfa == this.state.initialState.mfa &&
                     this.state.name == this.state.initialState.name
                        ? true
                        : false
                  }
               >
                  Submit{" "}
               </Button>
            </div>
         </div>
      );
   }
}
