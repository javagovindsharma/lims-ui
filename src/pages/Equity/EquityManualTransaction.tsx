import React from "react";
import { Alert, Button } from "react-bootstrap";
import "../../css/main.css";
import { ihubConstants } from "../../helpers/constants";
import { setTimeout } from "timers";
import Loading from "../../components/common/Loading";
import { UserUtils } from "../../lib/authenticationUtils";
import { submitEquityData } from "./EquityService";
import { getAssetManagers } from "../common/CommonService";
import AuditPage from "../common/Audit/AuditPage";
import PortfolioPage from "../common/Portfolio/PortfolioPage";
import CounterpartyPage from "../common/Counterparty/CounterpartyPage";
import MiscPage from "../common/Misc";
import InstrumentPage from "../common/Instrument/InstrumentPage";
import DealInformationPage from "../common/Deal/DealInformationPage";
import { commonError } from "../common/commonError";
import ArrivalPage from "../common/Arrival/ArrivalPage";

/* Mannaul Equity Transaction Page for User entry */
export default class EquityManualTransaction extends React.Component<
  { update: any },
  {}
> {
  state: any = {
    showAssetManager:
      UserUtils.getUser()?.assetManager === undefined ? true : false,

    assetManagers: [],

    //portfolio fields

    assetManager: "",
    behalf: "",

    //new security
    newSecurityPset: "",
    newSecurityCurrency: "",
    newSecurityIsin: "",

    //pageOperations
    showAlert: false,
    showSuccess: false,
    alertMessage: [],
    successMessage: [],
    typeAheadFailCount: 0,

    //lib
    Loading: false,
    isSubmitted: false,
    localVar: {},
    couponRate: "",
    settlementCurrency: "",
  };
  initialState: any;
  portfolioRef: React.RefObject<PortfolioPage> = React.createRef();
  counterpartyRef: React.RefObject<CounterpartyPage> = React.createRef();
  miscRef: React.RefObject<MiscPage> = React.createRef();
  instrumentRef: React.RefObject<InstrumentPage> = React.createRef();
  dealInformationRef: React.RefObject<DealInformationPage> = React.createRef();
  arrivalRef: React.RefObject<ArrivalPage> = React.createRef();

  constructor(props: { update: any }) {
    super(props);
    this.cancelData = this.cancelData.bind(this);
    this.setCommonThings = this.setCommonThings.bind(this);
    this.saveData = this.saveData.bind(this);
    this.showErrorMessage = this.showErrorMessage.bind(this);
    this.setAssetManager = this.setAssetManager.bind(this);
  }
  componentDidMount() {
    if (UserUtils.getUser()?.assetManager !== "") {
      this.setState({ assetManager: UserUtils.getUser()?.assetManager });
    }
  }
  componentWillMount() {
    this.initialState = this.state;
  }

  setInstrumentOptions(data: string[]) {
    this.setState({
      instrumentOptions: data,
    });
  }

  showErrorMessage(errorMsgs: string) {
    this.setState({ showAlert: true, alertMessage: errorMsgs });
  }

  saveData = () => {
    this.setState({ Loading: true });
    let errorMsgs: string[] = [];
    var fieldNames = [
      "ric",
      "bloombergId",
      "instrumentShort",
      "sedol",
      "cusip",
      "instrumentName",
      "instrumentQoutedCurrency",
      "instrumentExchange",
      "instrumentType",
      "instrumentCouponRate",
      "instrumentPset",
      "instrumentPsetFull",
    ];
    var errorMessageNames = [
      "BIC Code",
      "RIC",
      "Bloomberg ID",
      "Instrument Short",
      "Sedol",
      "Cusip",
      "instrument Name",
      "instrument Qouted Currency",
      "instrument Exchange",
      "instrument Type",
      "instrument Coupon Rate",
      "instrument Pset",
      "instrument Pset Full",
    ];
    // fieldNames = [];
    //un-comment above line to skip validations
    for (var i = 0; i < fieldNames.length; i++) {
      if (this.state[fieldNames[i]] === "") {
        errorMsgs.push("Please enter value for " + errorMessageNames[i]);
      }
    }
    errorMsgs = []; //ihub 379, validation removal
    if (errorMsgs.length > 0) {
      this.setState({
        showAlert: true,
        alertMessage: errorMsgs,
        Loading: false,
      });
    } else {
      //code to submit/post data to johan's service
      this.setState({ showAlert: false, alertMessage: [] });
      submitEquityData(this)
        .then((res) => {
          let errorMsg: any[] = [];
          switch (res.status) {
            case 201:
              errorMsg = [];
              errorMsg.push(res.data.toString());
              setTimeout(() => {
                this.setState(this.initialState);
                this.portfolioRef.current?.resetPortfolio();
                this.counterpartyRef.current?.resetCounterparty();
                this.instrumentRef.current?.resetInstrument();
                this.dealInformationRef.current?.resetDealInfo();
                this.arrivalRef.current?.resetArrival();
                this.miscRef.current?.resetMisc();
                this.setState({
                  showSuccess: true,
                  successMessage: errorMsg,
                  Loading: false,
                });
                this.componentDidMount();
              }, ihubConstants.loaderTimer.value);
              this.props.update();
              break;
            default:
              errorMsg.push(res.data.toString());
              setTimeout(() => {
                this.setState({
                  showAlert: true,
                  alertMessage: errorMsg,
                  Loading: false,
                });
              }, ihubConstants.loaderTimer.value);
              this.props.update();
              break;
          }
        })
        .catch((err) => {
          commonError(err.response.status, "EQUITYMANUALTRANS");
        });
    }
  };

  setCommonThings(instrument: any) {
    this.dealInformationRef?.current?.setState({
      dealQuoteFactor: instrument.quoteFactor,
      dealSettlementCurrency: instrument.currency,
      dealCurrency: instrument.currency,
    });
  }
  setAssetManager(assetmgr: string) {
    this.setState({ assetManager: assetmgr });
  }
  cancelData() {
    this.setState(this.initialState);
    this.portfolioRef.current?.resetPortfolio();
    this.counterpartyRef.current?.resetCounterparty();
    this.instrumentRef.current?.resetInstrument();
    this.dealInformationRef.current?.resetDealInfo();
    this.arrivalRef.current?.resetArrival();
    this.miscRef.current?.resetMisc();
    this.portfolioRef.current?.getAssetManagers();
  }

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
      <div className="GridWrapper">
        {/* audit */}
        {this.state.showSuccess && (
          <Alert
            variant="success"
            onClose={() =>
              this.setState({ showSuccess: false, successMessage: "" })
            }
            dismissible
          >
            <Alert.Heading>Success !</Alert.Heading>
            <ul>
              {this.state.successMessage.map(
                (
                  key:
                    | string
                    | number
                    | boolean
                    | {}
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactNodeArray
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | undefined
                ) => {
                  return <li key={index}> {key} </li>;
                }
              )}
            </ul>
          </Alert>
        )}
        {this.state.showAlert && (
          <Alert
            variant="danger"
            onClose={() =>
              this.setState({ showAlert: false, alertMessage: "" })
            }
            dismissible
          >
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <ul>
              {this.state.alertMessage.map(
                (
                  key:
                    | string
                    | number
                    | boolean
                    | {}
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactNodeArray
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | undefined
                ) => {
                  return <li key={index}> {key} </li>;
                }
              )}
            </ul>
          </Alert>
        )}
        <AuditPage />
        {/* portfolio */}

        <PortfolioPage
          txnType="EQUITY"
          ref={this.portfolioRef}
          setAssetManager={this.setAssetManager}
        />
        {/* counterparty */}
        <CounterpartyPage
          txnType="EQUITY"
          ref={this.counterpartyRef}
          assetManagerType={this.state.assetManager}
        />
        {SubmitLoading}
        {/* instrument */}
        <InstrumentPage
          txnType="EQUITY"
          ref={this.instrumentRef}
          common={this.setCommonThings}
          assetManagerType={this.state.assetManager}
          parent={this}
        />
        {/* Deal information */}
        <DealInformationPage
          txnType="EQUITY"
          otcIntrumenetType=""
          transactionCode=""
          ref={this.dealInformationRef}
          type={this.showErrorMessage}
          parent={this}
        />
        <ArrivalPage ref={this.arrivalRef} />
        {/* Misc */}
        <MiscPage ref={this.miscRef} txnType="EQUITY" />
        {this.state.showSuccess && (
          <Alert
            variant="success"
            onClose={() =>
              this.setState({ showSuccess: false, successMessage: "" })
            }
            dismissible
          >
            <Alert.Heading>Success !</Alert.Heading>
            <ul>
              {this.state.successMessage.map(
                (
                  key:
                    | string
                    | number
                    | boolean
                    | {}
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactNodeArray
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | undefined
                ) => {
                  return <li key={index}> {key} </li>;
                }
              )}
            </ul>
          </Alert>
        )}
        {this.state.showAlert && (
          <Alert
            variant="danger"
            onClose={() =>
              this.setState({ showAlert: false, alertMessage: "" })
            }
            dismissible
          >
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <ul>
              {this.state.alertMessage.map(
                (
                  key:
                    | string
                    | number
                    | boolean
                    | {}
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactNodeArray
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | undefined
                ) => {
                  return <li key={index}> {key} </li>;
                }
              )}
            </ul>
          </Alert>
        )}
        <div className="modal-footer">
          <Button
            type="button"
            variant="outline-primary"
            onClick={this.saveData}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            data-dismiss="modal"
            onClick={this.cancelData}
          >
            Clear
          </Button>
        </div>
      </div>
    );
  }
}
