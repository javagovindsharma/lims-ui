import React from "react";
import { Form, ListGroup, Table } from "react-bootstrap";
import { ihubConstants } from "../../../helpers/constants";
import { intialCounterparty } from "../../../types/CounterpartyTypes";
import { searchBroker, searchCounterparty } from "./CounterpartyService";

export default class CounterpartyPage extends React.Component<{
  txnType: string;
  assetManagerType: string;
}> {
  state = {
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
    typeAheadFailCount: 0,
    counterpartySearching: false,
    brokerSearching: false,
  };
  initialState: any;
  constructor(props: { txnType: string; assetManagerType: string }) {
    super(props);
    this.setCounterpartyOptions = this.setCounterpartyOptions.bind(this);
    this.setBrokerOptions = this.setBrokerOptions.bind(this);
  }

  componentWillMount() {
    this.initialState = this.state;
  }

  resetCounterparty() {
    this.setState(this.initialState);
  }

  setCounterpartyOptions(data: string[]) {
    //this.setState({counterpartyOptions : data});
    this.setState({
      counterpartyOptions: data,
    });
  }

  setBrokerOptions(data: string[]) {
    //this.setState({counterpartyOptions : data});
    this.setState({
      brokerOptions: data,
    });
  }

  //for Broker TypeAhead
  onBrokerChange = (e: { currentTarget: { value: any } }) => {
    const userBrokerInput = e.currentTarget.value;
    if (
      userBrokerInput.length ===
      ihubConstants.type_ahead_manual_transaction_characters.value +
        this.state.typeAheadFailCount
    ) {
      var bNames: string[] = [];
      this.setState({ brokerSearching: true });
      searchBroker(userBrokerInput, this.props.assetManagerType).then((res) => {
        this.setState({
          brokerSearchResponse: res ? res : [],
          brokerSearching: false,
        });
        this.setState({ brokerOptions: [] });
        for (var i = 0; i < this.state.brokerSearchResponse.length; i++) {
          bNames.push(this.state.brokerSearchResponse[i].brokerName);
        }
        const filteredBrokerOptions = bNames;
        this.setState({ filteredBrokerOptions });
      });
      if (bNames.length === 0) {
        this.setState({
          typeAheadFailCount: this.state.typeAheadFailCount + 1,
        });
      } else {
        this.setState({ typeAheadFailCount: 0 });
      }
      this.setBrokerOptions(bNames);
      this.setState({
        activeBrokerOption: 0,
        showBrokerOptions: true,
        userBrokerInput: e.currentTarget.value,
      });
    } else {
      this.setState({ typeAheadFailCount: 0 });
      if (this.state.filteredBrokerOptions.length > 0) {
        const filteredBrokerOptions = this.state.filteredBrokerOptions.filter(
          (optionName: string) =>
            (optionName + "")
              .toLowerCase()
              .indexOf(userBrokerInput.toLowerCase()) > -1
        );
        this.setState({ filteredBrokerOptions });
      }
      this.setState({
        activeBrokerOption: 0,
        showBrokerOptions: true,
        userBrokerInput: e.currentTarget.value,
      });
    }
  };
  //on Selecting Broker from TypeAhead
  onBrokerClick = (e: any) => {
    var currentBroker =
      this.state.brokerSearchResponse[this.state.activeBrokerOption];
    this.setState({
      activeBrokerOption: 0,
      filteredBrokerOptions: [],
      showBrokerOptions: false,
      userBrokerInput: e.currentTarget.innerText,
      brokerName: currentBroker.brokerName,
      brokerShort: currentBroker.brokerShort,
      brokercounterpartyBicCode: currentBroker.brokerBicCode,
    });
  };
  //for Choosing Broker from Options
  onBrokerKeyDown = (e: { keyCode: number }) => {
    const { activeBrokerOption, filteredBrokerOptions } = this.state;
    if (e.keyCode === ihubConstants.enter_key_code.value) {
      this.setState({
        activeBrokerOption: 0,
        showBrokerOptions: false,
        userBrokerInput: filteredBrokerOptions[activeBrokerOption],
        brokerName: filteredBrokerOptions[activeBrokerOption],
      });
    } else if (e.keyCode === ihubConstants.up_arrow_code.value) {
      if (activeBrokerOption === 0) {
        return;
      }
      this.setState({ activeBrokerOption: activeBrokerOption - 1 });
    } else if (e.keyCode === ihubConstants.down_arrow_code.value) {
      if (activeBrokerOption === filteredBrokerOptions.length - 1) {
        return;
      }
      //    this.state.filteredCounterpartyOptions[activeBrokerOption].focus();
      this.setState({ activeBrokerOption: activeBrokerOption + 1 });
    }
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
      var assetManagerValue = this.props.assetManagerType;
      this.setState({ counterpartySearching: true });
      searchCounterparty(userCounterpartyInput, assetManagerValue).then(
        (res) => {
          // counterpartySearchResponse = res?res:[];
          this.setState({
            counterpartySearchResponse: res ? res : [],
            counterpartySearching: false,
          });
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
      this.setCounterpartyOptions(cpNames);
      this.setState({
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

  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  render() {
    const {
      onCounterpartyChange,
      onCounterpartyKeyDown,
      onCounterpartyClick,
      onBrokerChange,
      onBrokerClick,
      onBrokerKeyDown,
    } = this;
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
                : this.state.counterpartySearching
                ? "Searching"
                : "No Option"}
            </em>
          </div>
        );
      }
    }
    let brokerSearchList;
    if (this.state.showBrokerOptions && this.state.userBrokerInput) {
      if (this.state.filteredBrokerOptions.length > 0) {
        brokerSearchList = (
          <ListGroup as="ul" className="options" variant="flush">
            {this.state.filteredBrokerOptions.map(
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
                if (index === this.state.activeBrokerOption) {
                  className = "style-option-active";
                }
                return (
                  <ListGroup.Item
                    as="li"
                    className={className}
                    key={index as number}
                    onClick={onBrokerClick}
                    onMouseEnter={() =>
                      this.setState({
                        activeBrokerOption: index,
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
      } else if (this.state.userBrokerInput.length < 3) {
        brokerSearchList = (
          <Form.Text id="passwordHelpBlock" muted>
            Please type min 3 characters to search broker
          </Form.Text>
        );
      } else {
        brokerSearchList = (
          <div className="no-options">
            <em>{this.state.brokerSearching ? "Searching" : "No Option"}</em>
          </div>
        );
      }
    }
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Counterparty</legend>
        <div>
          <Table
            borderless={true}
            size="sm"
            style={{
              width:
                this.props.txnType === "CFD" || this.props.txnType === "FUTURE"
                  ? "100%"
                  : "50%",
            }}
          >
            <tbody>
              <tr
                style={{ display: this.props.txnType === "TRS" ? "none" : "" }}
              >
                <td style={{ padding: "0.15rem", width: "1rem" }}>
                  <Form.Label htmlFor="fname">Counterparty Search: </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      width: "60%",
                    }}
                    size="sm"
                    type="text"
                    id="fname"
                    name="counterpartySearch"
                    onChange={onCounterpartyChange}
                    onKeyDown={onCounterpartyKeyDown}
                    value={this.state.userCounterpartyInput}
                    autoComplete="off"
                  />
                </td>
                {(this.props.txnType === "FUTURE" ||
                  this.props.txnType === "CFD") && (
                  <>
                    <td
                      className="brokerSearch"
                      style={{ padding: "0.15rem", width: "1rem" }}
                    >
                      <Form.Label htmlFor="brokerSearch">
                        Broker Search:
                      </Form.Label>
                    </td>
                    <td style={{ padding: "0.15rem" }}>
                      <Form.Control
                        style={{
                          minWidth: "-webkit-fill-available",
                          width: "60%",
                        }}
                        size="sm"
                        type="text"
                        id="brokerSearch"
                        name="brokerSearch"
                        onChange={onBrokerChange}
                        onKeyDown={onBrokerKeyDown}
                        autoComplete="off"
                        value={this.state.userBrokerInput}
                      />
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}></td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  {counterpartySearchList}{" "}
                </td>
                {(this.props.txnType === "CFD" ||
                  this.props.txnType === "FUTURE") && (
                  <>
                    <td style={{ padding: "0.15rem" }}></td>
                    <td style={{ padding: "0.15rem" }}> {brokerSearchList} </td>
                  </>
                )}
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="counterpartyName">
                    Counterparty Name:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      width: "60%",
                    }}
                    size="sm"
                    type="text"
                    id="counterpartyName"
                    name="counterpartyName"
                    value={this.state.counterpartyName}
                    disabled={this.props.txnType === "TRS"}
                    onChange={this.numericChangeHandler}
                  />
                </td>
                {(this.props.txnType === "FUTURE" ||
                  this.props.txnType === "CFD") && (
                  <>
                    <td
                      className="brokerSearch"
                      style={{ padding: "0.15rem", width: "1rem" }}
                    >
                      <Form.Label htmlFor="brokerName">Broker Name:</Form.Label>
                    </td>
                    <td style={{ padding: "0.15rem" }}>
                      <Form.Control
                        style={{
                          minWidth: "-webkit-fill-available",
                          width: "60%",
                        }}
                        size="sm"
                        type="text"
                        id="brokerName"
                        name="brokerName"
                        onChange={this.numericChangeHandler}
                        value={this.state.brokerName}
                      />
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="counterpartyShort">
                    Counterparty Short:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      width: "60%",
                    }}
                    size="sm"
                    type="text"
                    id="counterpartyShort"
                    name="counterpartyShort"
                    onChange={this.numericChangeHandler}
                    disabled={this.props.txnType === "TRS"}
                    value={this.state.counterpartyShort}
                  />
                </td>
                {(this.props.txnType === "FUTURE" ||
                  this.props.txnType === "CFD") && (
                  <>
                    {" "}
                    <td
                      className="brokerSearch"
                      style={{ padding: "0.15rem", width: "1rem" }}
                    >
                      <Form.Label htmlFor="brokerShort">
                        Broker Short:
                      </Form.Label>
                    </td>
                    <td style={{ padding: "0.15rem" }}>
                      <Form.Control
                        style={{
                          minWidth: "-webkit-fill-available",
                          width: "60%",
                        }}
                        size="sm"
                        type="text"
                        id="brokerShort"
                        name="brokerShort"
                        onChange={this.numericChangeHandler}
                        value={this.state.brokerShort}
                      />
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="counterpartyBicCode">
                    Bic Code:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      width: "60%",
                    }}
                    size="sm"
                    type="text"
                    id="counterpartyBicCode"
                    name="counterpartyBicCode"
                    onChange={this.numericChangeHandler}
                    disabled={this.props.txnType === "TRS"}
                    value={this.state.counterpartyBicCode}
                  />
                </td>
                {(this.props.txnType === "CFD" ||
                  this.props.txnType === "FUTURE") && (
                  <>
                    {" "}
                    <td
                      className="brokerSearch"
                      style={{ padding: "0.15rem", width: "1rem" }}
                    >
                      <Form.Label htmlFor="brokercounterpartyBicCode">
                        Broker Bic Code:
                      </Form.Label>
                    </td>
                    <td style={{ padding: "0.15rem" }}>
                      <Form.Control
                        style={{
                          minWidth: "-webkit-fill-available",
                          width: "60%",
                        }}
                        size="sm"
                        type="text"
                        id="brokercounterpartyBicCode"
                        name="brokercounterpartyBicCode"
                        onChange={this.numericChangeHandler}
                        value={this.state.brokercounterpartyBicCode}
                      />
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
