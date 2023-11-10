import React from "react";
import { Alert, Button, Form, Modal, Row, Col } from "react-bootstrap";
import { UserUtils } from "../../../lib/authenticationUtils";
import { getAssetManagers } from "../CommonService";
import { AddSDR } from "./NewSecurityService";

export class NewSecurityPage extends React.Component<
   { txnType: any; instrumentRef: any },
   {}
> {
   state: any = {
      handleClose: false,
      handleShow: true,
      showModal: false,
      showModalChild: false,
      assetManagers: [],
      requestType: "BOND",
      securityID: "",
      securityIdentifier: "TICKER",
      marketSector: "Govt",
      exchange: "",
      currency: "",
      allRequestTypes: [
         "BOND",
         "EQUITY",
         "FRA",
         "FUND",
         "FUTUREINDEX",
         "IRF",
         "OPTION",
      ],
      allSecurityIdentifiers: [
         "TICKER",
         "BB_GLOBAL",
         "BB_UNIQUE",
         "SEDOL",
         "ISIN",
         "CUSIP",
      ],
      allMarketSector: [
         "Govt",
         "Corp",
         "Mtge",
         "M-Mk t",
         "Muni",
         "Pfd",
         "Equity",
         "Comdty",
         "Index",
         "Curncy",
      ],
      validEmailCheck: false,
      assetMgr: "",
      responseMessage: "",
      responseStatus: "success",
      displayVal: "none",
   };
   modesofConfiguration = [
      { id: "NEW", name: "Create New Configuration" },
      { id: "MODIFY", name: "Modify existing Configuration" },
      { id: "COPY", name: "Copy existing configuration" },
      { id: "DELETE", name: "Delete existing configuration" },
   ];

   initialState: any;
   constructor(props: { txnType: any; instrumentRef: any }) {
      super(props);
      this.hideModal = this.hideModal.bind(this);
   }
   componentDidMount() {
      this.setState({
         requestType:
            this.props.txnType === undefined ? "BOND" : this.props.txnType,
      });
      if (UserUtils.getUser()?.assetManager === "") {
         getAssetManagers().then((res) => {
            const assetMgrsResponse = res ? res : [];
            this.setState({ assetManagers: assetMgrsResponse });
         });
      }
      this.initialState = this.state;
   }

   componentDidUpdate() {
      if (this.state.requestType !== this.props.txnType) {
         this.setState({
            requestType:
               this.props.txnType === undefined ? "BOND" : this.props.txnType,
         });
      }
   }

   clearSDR = () => {
      getAssetManagers().then((res) => {
         const assetMgrsResponse = res ? res : [];
         this.setState({ assetManagers: assetMgrsResponse });
      });
      this.setState(this.initialState);
   };

   hideModal() {
      this.setState({ ...this.state, showModal: false });
      this.setState({ ...this.initialState });
      getAssetManagers().then((res) => {
         const assetMgrsResponse = res ? res : [];
         this.setState({ assetManagers: assetMgrsResponse });
      });
   }

   formSubmission = (event: any) => {
      event.preventDefault();
      this.setState({ ...this.state, validEmailCheck: true });
      var fourLetterPattern = /^[A-Z]{4}$/g;
      var threeLetterPattern = /^[A-Z]{3}$/g;
      if (this.state.exchange.length > 0) {
         if (
            event.currentTarget.checkValidity() &&
            fourLetterPattern.test(this.state.exchange) &&
            threeLetterPattern.test(this.state.currency)
         ) {
            var sdr = {
               customerId: Number(UserUtils.getUser()?.customerId),
               requestType: this.state.requestType,
               currency: this.state.currency,
               securityId: this.state.securityID,
               securityKey: this.state.securityIdentifier,
               exchange: this.state.exchange,
               assetMgr: this.state.assetMgr,
               marketSector: this.state.marketSector,
            };
            this.props.instrumentRef.setState({
               ...this.props.instrumentRef.state,
               newSecurityCurrency: this.state.currency,
               StaticRequested: true,
            });
            AddSDR(sdr)
               .then((res) => {
                  if (res.status === 201) {
                     this.setState({
                        ...this.state,
                        responseMessage: "SDR Successfully Created",
                        responseStatus: "success",
                        showModalChild: true,
                     });
                     if (this.state.securityIdentifier === "TICKER") {
                     } else if (this.state.securityIdentifier === "BB_GLOBAL") {
                     } else if (this.state.securityIdentifier === "BB_UNIQUE") {
                     } else if (this.state.securityIdentifier === "SEDOL") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           sedol: this.state.securityID,
                           StaticRequested: true,
                        });
                     } else if (this.state.securityIdentifier === "ISIN") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           instrumentIsin: this.state.securityID,
                           StaticRequested: true,
                        });
                     } else if (this.state.securityIdentifier === "CUSIP") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           cusip: this.state.securityID,
                           StaticRequested: true,
                        });
                     }
                  } else {
                     this.setState({
                        ...this.state,
                        responseMessage: res.data,
                        responseStatus: "notSuccess",
                        showModalChild: true,
                     });
                  }
               })
               .catch((err) => {
                  this.setState({
                     ...this.state,
                     responseMessage:
                        "There is an error while creating SDR, Please try again",
                     responseStatus: "notSuccess",
                     showModalChild: true,
                  });
               });
         }
      } else {
         if (
            event.currentTarget.checkValidity() &&
            threeLetterPattern.test(this.state.currency)
         ) {
            var sdr = {
               customerId: Number(UserUtils.getUser()?.customerId),
               requestType: this.state.requestType,
               currency: this.state.currency,
               securityId: this.state.securityID,
               securityKey: this.state.securityIdentifier,
               exchange: this.state.exchange,
               assetMgr: this.state.assetMgr,
               marketSector: this.state.marketSector,
            };
            this.props.instrumentRef.setState({
               ...this.props.instrumentRef.state,
               newSecurityCurrency: this.state.securityID,
               StaticRequested: true,
            });
            AddSDR(sdr)
               .then((res) => {
                  if (res.status === 201) {
                     this.setState({
                        ...this.state,
                        responseMessage: "SDR Successfully Created",
                        responseStatus: "success",
                        showModalChild: true,
                     });
                     if (this.state.securityIdentifier === "TICKER") {
                     } else if (this.state.securityIdentifier === "BB_GLOBAL") {
                     } else if (this.state.securityIdentifier === "BB_UNIQUE") {
                     } else if (this.state.securityIdentifier === "SEDOL") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           sedol: this.state.securityID,
                           StaticRequested: true,
                        });
                     } else if (this.state.securityIdentifier === "ISIN") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           instrumentIsin: this.state.securityID,
                           StaticRequested: true,
                        });
                     } else if (this.state.securityIdentifier === "CUSIP") {
                        this.props.instrumentRef.setState({
                           ...this.props.instrumentRef.state,
                           cusip: this.state.securityID,
                           StaticRequested: true,
                        });
                     }
                  } else {
                     this.setState({
                        ...this.state,
                        responseMessage: res.data,
                        responseStatus: "notSuccess",
                        showModalChild: true,
                     });
                  }
               })
               .catch((err) => {
                  this.setState({
                     ...this.state,
                     responseMessage:
                        "There is an error while creating SDR, Please try again",
                     responseStatus: "notSuccess",
                     showModalChild: true,
                  });
               });
         }
      }
   };
   setShow = () => {
      this.setState({ showModal: true });
   };
   hideModalChild = () => {
      this.setState({ ...this.state, showModalChild: false });
   };

   render() {
      return (
         <>
            <Button variant="outline-primary" onClick={this.setShow}>
               New Security
            </Button>
            <Modal
               show={this.state.showModal}
               onHide={this.hideModal}
               name="logs"
            >
               <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle1">
                     New SDR : {this.state.fileInput}{" "}
                  </h5>
                  <button
                     type="button"
                     className="close"
                     onClick={this.hideModal}
                     aria-label="Close"
                  >
                     <span aria-hidden="true">&times;</span>
                  </button>
               </div>
               <div className="modal-content">
                  <div className="modal-body">
                     <div className="GridWrapper">
                        <Form
                           noValidate
                           validated={this.state.validEmailCheck}
                           onSubmit={this.formSubmission}
                        >
                           <Form.Group>
                              <Form.Label as={Row}>
                                 Select the Security Identifier{" "}
                                 <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              {this.state.allSecurityIdentifiers.map(
                                 (type: any) => {
                                    return (
                                       <Form.Check
                                          inline
                                          label={type}
                                          name="securityIdentifiers"
                                          value={this.state.securityIdentifier}
                                          type="radio"
                                          id={type}
                                          checked={
                                             this.state.securityIdentifier ===
                                             type
                                          }
                                          onChange={(e) =>
                                             this.setState({
                                                ...this.state,
                                                securityIdentifier: e.target.id,
                                             })
                                          }
                                       />
                                    );
                                 }
                              )}
                              <Form.Control.Feedback type="invalid">
                                 Please select Security Key
                              </Form.Control.Feedback>
                           </Form.Group>

                           <Form.Group as={Row}>
                              <Form.Label as={Col}>
                                 Security ID{" "}
                                 <span style={{ color: "red" }}>*</span>
                              </Form.Label>

                              <Form.Control
                                 className="col-md-6"
                                 autoFocus
                                 type="text"
                                 name="securityID"
                                 id="securityID"
                                 key="securityID"
                                 value={this.state.securityID}
                                 defaultValue={this.state.securityID}
                                 onChange={(e) =>
                                    this.setState({
                                       ...this.state,
                                       securityID: e.target.value,
                                    })
                                 }
                                 required
                              ></Form.Control>
                              <Form.Control.Feedback type="invalid">
                                 Please enter Security ID
                              </Form.Control.Feedback>
                           </Form.Group>

                           <Form.Group as={Row}>
                              <Form.Label as={Col}>Exchange</Form.Label>

                              <Form.Control
                                 className="col-md-6"
                                 autoFocus
                                 type="text"
                                 name="exchange"
                                 id="exchange"
                                 key="exchange"
                                 value={this.state.exchange}
                                 defaultValue={this.state.exchange}
                                 onChange={(e) =>
                                    this.setState({
                                       ...this.state,
                                       exchange: e.target.value,
                                    })
                                 }
                                 placeholder="Please enter 4 Upper case letter only"
                                 pattern="^[A-Z]{4}$"
                              ></Form.Control>

                              <Form.Control.Feedback type="invalid">
                                 Please enter 4 Upper case letter only
                              </Form.Control.Feedback>
                           </Form.Group>

                           <Form.Group as={Row}>
                              <Form.Label as={Col}>
                                 Currency{" "}
                                 <span style={{ color: "red" }}>*</span>
                              </Form.Label>

                              <Form.Control
                                 className="col-md-6"
                                 autoFocus
                                 type="text"
                                 name="currency"
                                 id="currency"
                                 key="currency"
                                 defaultValue={this.state.currency}
                                 value={this.state.currency}
                                 onChange={(e) =>
                                    this.setState({
                                       ...this.state,
                                       currency: e.target.value,
                                    })
                                 }
                                 placeholder="Please enter 3 Upper case letter only"
                                 pattern="^[A-Z]{3}$"
                                 required
                              ></Form.Control>

                              <Form.Control.Feedback type="invalid">
                                 Please enter 3 Upper case letter only
                              </Form.Control.Feedback>
                           </Form.Group>

                           <Form.Group as={Row}>
                              <Form.Label as={Col}>Asset Manager </Form.Label>
                              <Form.Control
                                 className="col-md-6"
                                 autoFocus
                                 as="select"
                                 name="assetMgrs"
                                 placeholder="Enter the full Name of the Group"
                                 id="assetMgrs"
                                 key="assetMgrs"
                                 value={this.state.assetMgr}
                                 //  onChange={editnewUser}
                                 //  ref={longNameTarget}
                                 required
                                 onChange={(e) =>
                                    this.setState({
                                       ...this.state,
                                       assetMgr: e.target.value,
                                    })
                                 }
                              >
                                 <option value="" disabled selected>
                                    Select Asset Manager
                                 </option>

                                 {this.state.assetManagers.map(
                                    (assetManager: any) => (
                                       <option
                                          key={assetManager}
                                          value={assetManager}
                                          selected={
                                             this.state.marketSector ===
                                             assetManager
                                          }
                                       >
                                          {assetManager}
                                       </option>
                                    )
                                 )}
                              </Form.Control>

                              <Form.Control.Feedback type="invalid">
                                 Please enter value for Asset Manager
                              </Form.Control.Feedback>
                           </Form.Group>

                           <Form.Group as={Row}>
                              <Form.Label as={Col}>
                                 Market Sector Group{" "}
                                 <span
                                    style={{
                                       color: "red",
                                       display:
                                          this.state.securityIdentifier ===
                                          "TICKER"
                                             ? ""
                                             : "none",
                                    }}
                                 >
                                    *
                                 </span>
                              </Form.Label>
                              <Form.Control
                                 className="col-md-6"
                                 autoFocus
                                 as="select"
                                 name="assetMgrs"
                                 id="assetMgrs"
                                 key="assetMgrs"
                                 //  onChange={editnewUser}
                                 //  ref={longNameTarget}
                                 required={
                                    this.state.securityIdentifier === "TICKER"
                                 }
                                 value={this.state.marketSector}
                                 //  onChange={editUser}
                                 onChange={(e) =>
                                    this.setState({
                                       ...this.state,
                                       marketSector: e.target.value,
                                    })
                                 }
                              >
                                 <option value="" disabled selected>
                                    Select Market Group
                                 </option>

                                 {this.state.allMarketSector.map(
                                    (mselector: any) => (
                                       <option
                                          key={mselector}
                                          value={mselector}
                                          selected={
                                             this.state.marketSector ===
                                             mselector
                                          }
                                       >
                                          {mselector}
                                       </option>
                                    )
                                 )}
                              </Form.Control>

                              <Form.Control.Feedback type="invalid" as={Col}>
                                 Please enter value for Market Group
                              </Form.Control.Feedback>
                           </Form.Group>
                           <Button type="submit" variant="outline-primary">
                              Add SDR
                           </Button>
                           <Button
                              variant="outline-secondary"
                              onClick={this.clearSDR}
                           >
                              Clear
                           </Button>
                        </Form>
                        <Modal
                           show={this.state.showModalChild}
                           onHide={this.hideModalChild}
                           name="logs"
                        >
                           <div className="modal-content uploadModal">
                              <div className="modal-header">
                                 <h5
                                    className="modal-title"
                                    id="exampleModalLongTitle"
                                 >
                                    New SDR : {this.state.fileInput}{" "}
                                 </h5>
                                 <button
                                    type="button"
                                    className="close"
                                    onClick={this.hideModal}
                                    aria-label="Close"
                                 >
                                    <span aria-hidden="true">&times;</span>
                                 </button>
                              </div>
                              <div className="modal-body uploadLogs">
                                 <Alert
                                    key="alert"
                                    variant={
                                       this.state.responseStatus === "success"
                                          ? "success"
                                          : "danger"
                                    }
                                 >
                                    {this.state.responseMessage}
                                 </Alert>
                              </div>
                              <div className="modal-footer">
                                 <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={this.hideModalChild}
                                 >
                                    Close
                                 </button>
                              </div>
                           </div>
                        </Modal>
                     </div>
                  </div>
               </div>
            </Modal>
         </>
      );
   }
}
