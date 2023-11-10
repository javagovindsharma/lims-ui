import React from "react";
import { Form, ListGroup, Table } from "react-bootstrap";
import { ihubConstants } from "../../../helpers/constants";
import { searchInstruments } from "../../common/Instrument/IntrumentService";
import { NewSecurityPage } from "../NewSecurity/NewSecurityPage";
export default class InstrumentPage extends React.Component<{
  txnType: string;
  common: any;
  assetManagerType: string;
  parent: any;
}> {
  public file!: File;
  state = {
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
    instrumentUnderLying: "",
    instrumentPsetFull: "",
    instrumentPset: "",
    instrumentCouponRate: "",
    instrumentType: "",
    instrumentExchange: "",
    instrumentQoutedCurrency: "",
    instrumentOptionType: "",
    instrumentName: "",
    cusip: "",
    sedol: "",
    instrumentShort: "",
    bloombergId: "",
    ric: "",
    securityIdentifier: "",
    instrumentIsin: "",
    instrumentExerciseStyle: "",
    strikePrice: "",
    instrumentContractSize: 0,
    //new security
    newSecurityPset: "",
    newSecurityCurrency: "",
    newSecurityIsin: "",
    instrumentSettlementCurrency: "",
    StaticRequested: false,
    instrumentSearching: false,
  };
  initialState: any;
  //eslint-disable-next-line
  constructor(props: {
    txnType: string;
    common: any;
    assetManagerType: string;
    parent: any;
  }) {
    super(props);
  }
  componentDidMount() {
    this.initialState = this.state;
  }

  setInstrumentOptions(data: string[]) {
    //this.setState({InstrumentOptions : data});
    this.setState({
      instrumentOptions: data,
    });
  }

  resetInstrument() {
    this.setState(this.initialState);
  }

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
    this.props.common(currentinstrument);
  };

  //for instrument type ahead :
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
      this.setState({ instrumentSearching: true });
      searchInstruments(
        userInstrumentInput,
        this.props.txnType,
        this.props.assetManagerType
      ).then((res) => {
        this.setState({ instrumentSearching: true });
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
      this.setInstrumentOptions(instrumentNames);
      this.setState({
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

  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
    if (nam === "instrumentCouponRate") {
      this.props.parent.setState({ couponRate: Number(val) });
      this.props.parent.dealInformationRef?.current.setState({
        dealCouponRate: Number(val),
      });
    } else if (nam === "instrumentSettlementCurrency") {
      this.props.parent.setState({ settlementCurrency: val });
      this.props.parent.dealInformationRef?.current.setState({
        dealSettlementCurrency: val,
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

  render() {
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
            <em>
              {this.state.instrumentSearching ? "Searching" : "No Option"}
            </em>
          </div>
        );
      }
    }
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Instrument</legend>
        <div>
          <Table borderless={true}>
            <tbody>
              <tr
                style={{
                  display: this.props.txnType !== "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="securityIdentifier">
                    Security Identifier:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="securityIdentifier"
                    name="securityIdentifier"
                    onChange={this.onInstrumentChange}
                    value={this.state.userInstrumentInput}
                    onKeyDown={this.onInstrumentKeyDown}
                    autoComplete="off"
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="ric">RIC:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="ric"
                    name="ric"
                    onChange={this.numericChangeHandler}
                    value={this.state.ric}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="bloombergId">Bloomberg id:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="bloombergId"
                    name="bloombergId"
                    onChange={this.numericChangeHandler}
                    value={this.state.bloombergId}
                  />
                </td>
              </tr>

              {this.props.txnType === "OPTION" ? (
                <tr>
                  <td
                    style={{ padding: "0.15rem" }}
                    className="bondInstrumentTd"
                  >
                    <Form.Label htmlFor="securityIdentifier">
                      Security Identifier:
                    </Form.Label>
                  </td>
                  <td
                    style={{ padding: "0.15rem" }}
                    className="bondInstrumentTd"
                  >
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "60%",
                      }}
                      type="text"
                      id="securityIdentifier"
                      name="securityIdentifier"
                      onChange={this.onInstrumentChange}
                      value={this.state.userInstrumentInput}
                      onKeyDown={this.onInstrumentKeyDown}
                      autoComplete="off"
                    />
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="instrumentIsin">ISIN:</Form.Label>
                  </td>
                  <td
                    style={{ padding: "0.15rem" }}
                    className="bondInstrumentTd"
                  >
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "60%",
                      }}
                      type="text"
                      id="instrumentIsin"
                      name="instrumentIsin"
                      onChange={this.numericChangeHandler}
                      value={this.state.instrumentIsin}
                    />
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="bloombergId">Bloomberg id:</Form.Label>
                  </td>
                  <td
                    style={{ padding: "0.15rem" }}
                    className="bondInstrumentTd"
                  >
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "60%",
                      }}
                      type="text"
                      id="bloombergId"
                      name="bloombergId"
                      onChange={this.numericChangeHandler}
                      value={this.state.bloombergId}
                    />
                  </td>
                </tr>
              ) : (
                <></>
              )}

              <tr>
                <td style={{ padding: "0" }}></td>
                <td style={{ padding: "0" }}>{instrumentSearchList}</td>
              </tr>
              <tr
                style={{
                  display: this.props.txnType !== "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentShort">
                    Instrument Short:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentShort"
                    name="instrumentShort"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentShort}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="sedol">SEDOL:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="sedol"
                    name="sedol"
                    onChange={this.numericChangeHandler}
                    value={this.state.sedol}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="cusip">CUSIP:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="cusip"
                    name="cusip"
                    onChange={this.numericChangeHandler}
                    value={this.state.cusip}
                  />
                </td>
              </tr>

              <tr
                style={{
                  display: this.props.txnType === "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentShort">
                    Instrument Short:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentShort"
                    name="instrumentShort"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentShort}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="strikePrice">Strike Price:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="strikePrice"
                    name="strikePrice"
                    onChange={this.numericChangeHandler}
                    value={this.state.strikePrice}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentExerciseStyle">
                    Exercise Style:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentExerciseStyle"
                    name="instrumentExerciseStyle"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentExerciseStyle}
                  />
                </td>
              </tr>

              <tr
                style={{
                  display: this.props.txnType !== "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentName">
                    Instrument Name:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentName"
                    name="instrumentName"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentName}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentQoutedCurrency">
                    Quoted Currency:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentQoutedCurrency"
                    name="instrumentQoutedCurrency"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentQoutedCurrency}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentExchange">
                    Exchange:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentExchange"
                    name="instrumentExchange"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentExchange}
                  />
                </td>
              </tr>

              <tr
                style={{
                  display: this.props.txnType === "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentName">
                    Instrument Name:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentName"
                    name="instrumentName"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentName}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentOptionType">
                    Option Type:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentOptionType"
                    name="instrumentOptionType"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentOptionType}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentContractSize">
                    Contract Size:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentContractSize"
                    name="instrumentContractSize"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentContractSize}
                  />
                </td>
              </tr>

              <tr
                style={{
                  display: this.props.txnType !== "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentType">
                    Instrument Type:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentType"
                    name="instrumentType"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentType}
                  />
                </td>
                <td
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "BOND" ||
                      this.props.txnType === "OPTION" ||
                      this.props.txnType === "FX"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Label
                    htmlFor="instrumentCouponRate"
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                  >
                    Coupon Rate:
                  </Form.Label>
                </td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "BOND" ||
                      this.props.txnType === "OPTION" ||
                      this.props.txnType === "FX"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentCouponRate"
                    name="instrumentCouponRate"
                    onChange={this.numericChangeHandler}
                    value={this.props.parent.state.couponRate}
                  />
                </td>
                <td
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "EQUITY" ||
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Label
                    htmlFor="instrumentSettlementCurrency"
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                  >
                    Settlement Currency:
                  </Form.Label>
                </td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "EQUITY" ||
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentSettlementCurrency"
                    name="instrumentSettlementCurrency"
                    onChange={this.numericChangeHandler}
                    value={this.props.parent.state.settlementCurrency}
                  />
                </td>
                <td
                  style={{
                    padding: "0.15rem",
                    display: this.props.txnType !== "RE" ? "" : "none",
                  }}
                >
                  <Form.Label htmlFor="instrumentIsin">ISIN:</Form.Label>
                </td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    padding: "0.15rem",
                    display: this.props.txnType !== "RE" ? "" : "none",
                  }}
                >
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentIsin"
                    name="instrumentIsin"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentIsin}
                  />
                </td>
              </tr>

              <tr
                style={{
                  display: this.props.txnType === "OPTION" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Label htmlFor="instrumentType">
                    Instrument Type:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentType"
                    name="instrumentType"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentType}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="instrumentUnderLying">
                    Underlying:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentUnderLying"
                    name="instrumentUnderLying"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentUnderLying}
                  />
                </td>
              </tr>

              <tr>
                <td
                  style={{ padding: "0.15rem" }}
                  className="bondInstrumentTd"
                ></td>
                <td style={{ padding: "0.15rem" }} className="bondInstrumentTd">
                  <NewSecurityPage
                    txnType={this.props.txnType}
                    instrumentRef={this}
                  />
                </td>
                <td
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Label htmlFor="instrumentPset">PSET:</Form.Label>
                </td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentPset"
                    name="instrumentPset"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentPset}
                  />
                </td>
                <td
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Label htmlFor="instrumentPsetFull">
                    PSET Full:
                  </Form.Label>
                </td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    padding: "0.15rem",
                    display:
                      this.props.txnType === "CFD" ||
                      this.props.txnType === "FUTURE" ||
                      this.props.txnType === "RE"
                        ? ""
                        : "none",
                  }}
                >
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    type="text"
                    id="instrumentPsetFull"
                    name="instrumentPsetFull"
                    onChange={this.numericChangeHandler}
                    value={this.state.instrumentPsetFull}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
