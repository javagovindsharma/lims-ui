import React from "react";
import { Alert, Button, Form, ListGroup, Table } from "react-bootstrap";
import { ihubConstants } from "../../helpers/constants";
import { setTimeout } from "timers";
import Loading from "../../components/common/Loading";
import { UserUtils } from "../../lib/authenticationUtils";
import { submitDepositData } from "./DepositService";
import { getAssetManagers } from "../common/CommonService";
import AuditPage from "../common/Audit/AuditPage";
import PortfolioPage from "../common/Portfolio/PortfolioPage";
import CounterpartyPage from "../common/Counterparty/CounterpartyPage";
import MiscPage from "../common/Misc";
import InstrumentPage from "../common/Instrument/InstrumentPage";
import DealInformationPage from "../common/Deal/DealInformationPage";
import { commonError } from "../common/commonError";
import { searchInstruments } from "../common/Instrument/IntrumentService";
import { intialCounterparty } from "../../types/CounterpartyTypes";
import { searchCounterparty } from "../common/Counterparty/CounterpartyService";
/* Mannaul Deposit Transaction Page for User to enter the transaction details */

export default class DepositManualTransaction extends React.Component<
  { update: any },
  {}
> {
  state: any = {
    showAssetManager:
      UserUtils.getUser()?.assetManager === undefined ? true : false,

    //portfolio fields
    assetManager: "",
    behalf: "",
    assetManagers: [],

    // page operation
    showAlert: false,
    showSuccess: false,
    alertMessage: [],
    successMessage: [],

    //lib
    Loading: false,
    isSubmitted: false,
    couponRate: "",
    settlementCurrency: "",
    typeAheadFailCount: 0,
    activeInstrumentOption: 0,
    filteredInstrumentOptions: [],
    showInstrumentOptions: false,
    userInstrumentInput: "",
    instrumentOptions: [],
    instrumentSearchResponse: [
      {
        id: "",
        isin: "",
        cusip: "",
        sedol: "",
        bloombergId: "",
        currency: "",
        instrumentName: "",
        instrumentShort: "",
        instrumentType: "",
        ric: "",
        exchange: "",
        scdunid: "",
        quoteFactor: "",
        instrumentExerciseStyle: "",
        strikePrice: "",
      },
    ],
    // counterparty fields below
    instrumentName: "",
    instrumentShort: "",
    securityIdentifier: "",
    instrumentIsin: "",
    instrumentExerciseStyle: "",
    activeCounterpartyOption: 0,
    filteredCounterpartyOptions: [],
    showCounterpartyOptions: false,
    userCounterpartyInput: "",

    activeBrokerOption: 0,
    filteredBrokerOptions: [],
    showBrokerOptions: false,
    userBrokerInput: "",
    // counterparty fields below
    counterpartyObject: intialCounterparty,
    counterpartyName: "",
    counterpartyShort: "",
    counterpartyBicCode: "",
    counterpartyOptions: [],
    counterpartySearchResponse: [
      {
        id: "",
        customerId: "",
        counterpartyName: "",
        counterpartyShort: "",
        scdunid: "",
        counterpartyBicCode: "",
      },
    ],

    // broker fields below
    brokerObject: intialCounterparty,
    brokerName: "",
    brokerShort: "",
    brokercounterpartyBicCode: "",
    brokerOptions: [],
    brokerSearchResponse: [
      {
        id: "",
        customerId: "",
        brokerName: "",
        brokerShort: "",
        scdunid: "",
        brokercounterpartyBicCode: "",
        brokerBicCode: "",
      },
    ],
    counterpartyFilterRespValue: "",
    currency: "",
  };

  initialState: any;
  portfolioRef: React.RefObject<PortfolioPage> = React.createRef();
  counterpartyRef: React.RefObject<CounterpartyPage> = React.createRef();
  miscRef: React.RefObject<MiscPage> = React.createRef();
  instrumentRef: React.RefObject<InstrumentPage> = React.createRef();
  dealInformationRef: React.RefObject<DealInformationPage> = React.createRef();
  constructor(props: { update: any }) {
    super(props);
    this.cancelData = this.cancelData.bind(this);
    this.setCommonThings = this.setCommonThings.bind(this);
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

  saveData = () => {
    this.setState({ Loading: true });
    let errorMsgs: string[] = [];
    var fieldNames = [
      "assetManager", 
      "instrumentShort", 
      "counterpartyShort"
    ];
    var errorMessageNames = [
      "Asset Manager", 
      "Instrument", 
      "Counter Party"
    ];
    for (var i = 0; i < fieldNames.length; i++) {
      if (this.state[fieldNames[i]] === "") {
        errorMsgs.push(errorMessageNames[i] + " can not be empty.");
      }
    }
    if (errorMsgs.length > 0) {
      this.setState({ showAlert: true, alertMessage: errorMsgs });
    } else {
      //code to submit/post data to johan's service
      this.setState({ showAlert: false, alertMessage: [] });
      submitDepositData(this)
        .then((res) => {
          let errorMsg: any[] = [];
          switch (res.status) {
            case 201:
              errorMsg = [];
              errorMsg.push(res.data.toString());
              setTimeout(() => {
                this.portfolioRef.current?.resetPortfolio();
                this.counterpartyRef.current?.resetCounterparty();
                this.instrumentRef.current?.resetInstrument();
                this.dealInformationRef.current?.resetDealInfo();
                this.miscRef.current?.resetMisc();
                this.setState(this.initialState);
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
          commonError(err.response.status, "DEPOSITMANUALTRANS");
        });
    }
  };
  setCommonThings(instrument: any) {
    this.dealInformationRef?.current?.setState({
      dealQuoteFactor: instrument.quoteFactor,
      // bondTypeABSorMBS: instrument.bondTypeABSorMBS,
      poolFactorValues: instrument.poolFactorValues
        ? instrument.poolFactorValues
        : [0, 1],
      dealCurrency: instrument.currency,
    });
  }

  setAssetManager(assetmgr: string) {
    this.setState({ assetManager: assetmgr });
  }

  showErrorMessage(errorMsgs: string) {
    this.setState({ showAlert: true, alertMessage: errorMsgs });
  }
  cancelData() {
    this.portfolioRef.current?.resetPortfolio();
    this.counterpartyRef.current?.resetCounterparty();
    this.instrumentRef.current?.resetInstrument();
    this.dealInformationRef.current?.resetDealInfo();
    this.miscRef.current?.resetMisc();
    this.setState(this.initialState);
    this.portfolioRef.current?.getAssetManagers();
  }

  onInstrumentChange = (e: { currentTarget: { value: any } }) => {
    const userInstrumentInput = e.currentTarget.value;
    //code for fetching
    if (
      userInstrumentInput.length ===
      ihubConstants.type_ahead_manual_transaction_characters.value +
        this.state.typeAheadFailCount
    ) {
      //call axios here to get list of all instrument that matches the 3 letter string
      var instrumentNames: string[] = [];
      searchInstruments(
        userInstrumentInput,
        "DEPOSIT",
        this.state.assetManager
      ).then((res) => {
        // instrumentSearchResponse = res?res:[];
        this.setState({ instrumentSearchResponse: res ? res : [] });
        this.setState({ instrumentOptions: [] });
        for (var i = 0; i < this.state.instrumentSearchResponse.length; i++) {
          instrumentNames.push(
            this.state.instrumentSearchResponse[i].instrumentName
          );
        }
        const filteredInstrumentOptions = instrumentNames;
        this.setState({ filteredInstrumentOptions });
      });
      if (instrumentNames.length === 0) {
        this.setState({
          typeAheadFailCount: this.state.typeAheadFailCount + 1,
        });
      } else {
        this.setState({ typeAheadFailCount: 0 });
      }
      this.setState({
        instrumentOptions: instrumentNames,
        activeInstrumentOption: 0,
        // filteredInstrumentOptions,
        showInstrumentOptions: true,
        userInstrumentInput: e.currentTarget.value,
      });
    } else {
      this.setState({ typeAheadFailCount: 0 });
      if (this.state.filteredInstrumentOptions.length > 0) {
        const filteredInstrumentOptions =
          this.state.filteredInstrumentOptions.filter(
            (optionName: string) =>
              (optionName + "")
                .toLowerCase()
                .indexOf(userInstrumentInput.toLowerCase()) > -1
          );
        this.setState({ filteredInstrumentOptions });
      }

      this.setState({
        activeInstrumentOption: 0,
        showInstrumentOptions: true,
        userInstrumentInput: e.currentTarget.value,
      });
    }
  };
  onInstrumentKeyDown = (e: { keyCode: number }) => {
    const { activeInstrumentOption, filteredInstrumentOptions } = this.state;
    var currentinstrument =
      this.state.instrumentSearchResponse[activeInstrumentOption];
    if (e.keyCode === ihubConstants.enter_key_code.value) {
      this.setState({
        activeInstrumentOption: 0,
        showInstrumentOptions: false,
        userInstrumentInput: filteredInstrumentOptions[activeInstrumentOption],
        instrumentName: filteredInstrumentOptions[activeInstrumentOption],
        //other fields of instrument are set below
        instrumentShort: currentinstrument?.instrumentShort,
        instrumentType: currentinstrument?.instrumentType,
        bondTypeABSorMBS:
          currentinstrument?.instrumentType === "MBS" ||
          currentinstrument?.instrumentType === "ABS"
            ? true
            : false,
        cusip: currentinstrument?.cusip,
        sedol: currentinstrument?.sedol,
        bloombergId: currentinstrument?.bloombergId,
        ric: currentinstrument?.ric,
        instrumentQoutedCurrency: currentinstrument?.currency,
        instrumentExchange: currentinstrument?.exchange,
        dealCurrency: currentinstrument?.currency,
        instrumentIsin: currentinstrument?.isin,
      });
    } else if (e.keyCode === ihubConstants.up_arrow_code.value) {
      if (activeInstrumentOption === 0) {
        return;
      }
      this.setState({ activeInstrumentOption: activeInstrumentOption - 1 });
    } else if (e.keyCode === ihubConstants.down_arrow_code.value) {
      if (activeInstrumentOption === filteredInstrumentOptions.length - 1) {
        return;
      }
      this.setState({ activeInstrumentOption: activeInstrumentOption + 1 });
    }
  };

  onInstrumentClick = (e: any) => {
    var currentinstrument =
      this.state.instrumentSearchResponse[this.state.activeInstrumentOption];
    // alert(currentinstrument.isin);
    this.setState({
      activeInstrumentOption: 0,
      filteredInstrumentOptions: [],
      showInstrumentOptions: false,
      userInstrumentInput: e.currentTarget.innerText,
      //other fields of instrument are set below
      instrumentName: e.currentTarget.innerText,
      instrumentShort: currentinstrument.instrumentShort,
      instrumentType: currentinstrument.instrumentType,

      cusip: currentinstrument.cusip,
      sedol: currentinstrument.sedol,
      bloombergId: currentinstrument.bloombergId,
      ric: currentinstrument.ric,
      instrumentQoutedCurrency: currentinstrument.currency,
      instrumentExchange: currentinstrument.exchange,
      instrumentIsin: currentinstrument.isin,
    });
    //  this.props.common(currentinstrument);
  };

  onCounterpartyChange = (e: { currentTarget: { value: any } }) => {
    const userCounterpartyInput = e.currentTarget.value;
    //code for fetching
    if (
      userCounterpartyInput.length ===
      ihubConstants.type_ahead_manual_transaction_characters.value +
        this.state.typeAheadFailCount
    ) {
      //call axios here to get list of all counterparty that matches the 3 letter string
      var cpNames: string[] = [];
      var assetManagerValue = this.state.assetManager;
      searchCounterparty(userCounterpartyInput, assetManagerValue).then(
        (res) => {
          // counterpartySearchResponse = res?res:[];
          this.setState({ counterpartySearchResponse: res ? res : [] });
          this.setState({ counterpartyOptions: [] });
          for (
            var i = 0;
            i < this.state.counterpartySearchResponse.length;
            i++
          ) {
            cpNames.push(
              this.state.counterpartySearchResponse[i].counterpartyName
            );
          }
          const filteredCounterpartyOptions = cpNames;
          this.setState({ filteredCounterpartyOptions });
          if ("Too many hits" === res) {
            this.setState({ counterpartyFilterRespValue: res });
          } else {
            this.setState({ counterpartyFilterRespValue: "" });
          }
        }
      );
      if (cpNames.length === 0) {
        this.setState({
          typeAheadFailCount: this.state.typeAheadFailCount + 1,
        });
      } else {
        this.setState({ typeAheadFailCount: 0 });
      }
      this.setState({
        counterpartyOptions: cpNames,
        activeCounterpartyOption: 0,
        // filteredCounterpartyOptions,
        showCounterpartyOptions: true,
        userCounterpartyInput: e.currentTarget.value,
      });
    } else {
      this.setState({ typeAheadFailCount: 0 });
      if (this.state.filteredCounterpartyOptions.length > 0) {
        const filteredCounterpartyOptions =
          this.state.filteredCounterpartyOptions.filter(
            (optionName: string) =>
              (optionName + "")
                .toLowerCase()
                .indexOf(userCounterpartyInput.toLowerCase()) > -1
          );
        this.setState({ filteredCounterpartyOptions });
      }

      this.setState({
        activeCounterpartyOption: 0,
        showCounterpartyOptions: true,
        userCounterpartyInput: e.currentTarget.value,
      });
    }
  };

  onCounterpartyKeyDown = (e: { keyCode: number }) => {
    const { activeCounterpartyOption, filteredCounterpartyOptions } =
      this.state;
    var currentCounterparty =
      this.state.counterpartySearchResponse[activeCounterpartyOption];
    if (e.keyCode === ihubConstants.enter_key_code.value) {
      this.setState({
        activeCounterpartyOption: 0,
        showCounterpartyOptions: false,
        userCounterpartyInput:
          filteredCounterpartyOptions[activeCounterpartyOption],
        counterpartyName: filteredCounterpartyOptions[activeCounterpartyOption],
        //other counterparty values set below
        counterpartyShort: currentCounterparty?.counterpartyShort,
        counterpartyBicCode: currentCounterparty?.counterpartyBicCode,
      });
    } else if (e.keyCode === ihubConstants.up_arrow_code.value) {
      if (activeCounterpartyOption === 0) {
        return;
      }
      this.setState({
        activeCounterpartyOption: activeCounterpartyOption - 1,
        userCounterpartyInput:
          filteredCounterpartyOptions[activeCounterpartyOption - 1],
      });
    } else if (e.keyCode === ihubConstants.down_arrow_code.value) {
      if (activeCounterpartyOption === filteredCounterpartyOptions.length - 1) {
        return;
      }
      this.setState({
        activeCounterpartyOption: activeCounterpartyOption + 1,
        userCounterpartyInput:
          filteredCounterpartyOptions[activeCounterpartyOption + 1],
      });
    }
  };

  onCounterpartyClick = (e: any) => {
    var currentCounterparty =
      this.state.counterpartySearchResponse[
        this.state.activeCounterpartyOption
      ];
    this.setState({
      activeCounterpartyOption: 0,
      filteredCounterpartyOptions: [],
      showCounterpartyOptions: false,
      userCounterpartyInput: e.currentTarget.innerText,
      //setting other values of counterparty legend
      counterpartyName: e.currentTarget.innerText,
      counterpartyShort: currentCounterparty.counterpartyShort,
      counterpartyBicCode: currentCounterparty.counterpartyBicCode,
    });
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
    let instrumentSearchList;
    if (this.state.showInstrumentOptions && this.state.userInstrumentInput) {
      if (this.state.filteredInstrumentOptions.length) {
        instrumentSearchList = (
          <ListGroup as="ul" className="options">
            {this.state.filteredInstrumentOptions.map(
              (
                optionName:
                  | boolean
                  | React.ReactChild
                  | React.ReactFragment
                  | React.ReactPortal
                  | null
                  | undefined,
                index: React.Key | undefined
              ) => {
                let className;
                if (index === this.state.activeInstrumentOption) {
                  className = "style-option-active";
                }
                return (
                  <ListGroup.Item
                    as="li"
                    className={className}
                    key={index}
                    onClick={this.onInstrumentClick}
                    onMouseEnter={() => {
                      this.setState({ activeInstrumentOption: index });
                    }}
                  >
                    {optionName}
                  </ListGroup.Item>
                );
              }
            )}
          </ListGroup>
        );
      } else if (this.state.userInstrumentInput.length < 3) {
        instrumentSearchList = (
          <Form.Text id="passwordHelpBlock" muted>
            Please type min 3 characters to search instrument
          </Form.Text>
        );
      } else {
        instrumentSearchList = (
          <div className="no-options">
            <em>No Option!</em>
          </div>
        );
      }
    }
    const { onCounterpartyChange, onCounterpartyKeyDown, onCounterpartyClick } =
      this;
    let counterpartySearchList;
    if (
      this.state.showCounterpartyOptions &&
      this.state.userCounterpartyInput
    ) {
      if (this.state.filteredCounterpartyOptions.length) {
        counterpartySearchList = (
          <ListGroup as="ul" className="options" variant="flush">
            {this.state.filteredCounterpartyOptions.map(
              (optionName: boolean, index: number) => {
                let className;
                if (index === this.state.activeCounterpartyOption) {
                  className = "style-option-active";
                }
                return (
                  <ListGroup.Item
                    as="li"
                    className={className}
                    key={index}
                    onClick={onCounterpartyClick}
                    onMouseEnter={() =>
                      this.setState({
                        activeCounterpartyOption: index,
                      })
                    }
                  >
                    {optionName}
                  </ListGroup.Item>
                );
              }
            )}
          </ListGroup>
        );
      } else if (this.state.userCounterpartyInput.length < 3) {
        counterpartySearchList = (
          <Form.Text id="passwordHelpBlock" muted>
            Please type min 3 characters to search counterparty
          </Form.Text>
        );
      } else {
        counterpartySearchList = (
          <div className="no-options">
            <em>
              {this.state.counterpartyFilterRespValue.length > 1
                ? this.state.counterpartyFilterRespValue
                : "No Option!"}
            </em>
          </div>
        );
      }
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
          txnType="DEPOSIT"
          ref={this.portfolioRef}
          setAssetManager={this.setAssetManager}
        />
        {/* counterparty */}
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Instrument</legend>
          <div>
            <Table
              className="dealInfoTable"
              borderless
              style={{ width: "30%" }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>Instrument:</Form.Label>{" "}
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      type="text"
                      id="securityIdentifier"
                      name="securityIdentifier"
                      onChange={this.onInstrumentChange}
                      value={this.state.userInstrumentInput}
                      onKeyDown={this.onInstrumentKeyDown}
                      autoComplete="off"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0" }}></td>
                  <td style={{ padding: "0" }}> {instrumentSearchList} </td>
                </tr>
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>Counterparty:</Form.Label>{" "}
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      style={{ minWidth: "-webkit-fill-available" }}
                      type="text"
                      id="fname"
                      size="sm"
                      name="counterpartySearch"
                      onChange={onCounterpartyChange}
                      onKeyDown={onCounterpartyKeyDown}
                      value={this.state.userCounterpartyInput}
                      autoComplete="off"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0" }}></td>
                  <td style={{ padding: "0" }}>{counterpartySearchList}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </fieldset>

        {SubmitLoading}

        {/* Deal information */}
        <DealInformationPage
          txnType="DEPOSIT"
          otcIntrumenetType=""
          transactionCode=""
          ref={this.dealInformationRef}
          type={this.showErrorMessage}
          parent={this}
        />

        {/* Misc */}
        <MiscPage txnType="DEPOSIT" ref={this.miscRef} />
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
