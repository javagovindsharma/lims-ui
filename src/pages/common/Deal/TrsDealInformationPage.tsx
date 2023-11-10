import React from "react";
import { Table, Form } from "react-bootstrap";
import { getCurrencyCrosses } from "../Deal/DealService";
import QuickKey from "./QuickKey";
import Results from "./QuickKey";

export default class TrsDealInformationPage extends React.Component<{
  txnType: string;
  otcIntrumenetType: string;
  transactionCode: string;
  type: any;
  parent: any;
}> {
  public file!: File;
  state = {
    errors: {
      dealQuoteFactor: "",
      dealPrice: "",
    },
    dealTradeDate: "",
    dealValueDate: "",
    dealFee1: 0,
    dealFee2: 0,
    dealFee3: 0,
    dealNumberOfUnderlyingUnitslegno1: "",
    dealNumberOfUnderlyingUnitslegno2: "",
    dealUnderlyingPricelegno1: "",
    dealUnderlyingPricelegno2: "",
    dealCurrencylegno1: "",
    dealCurrencylegno2: "",
    dealCurrencyRatelegno1: "",
    dealCurrencyRatelegno2: "",
    dealUnderlyingCurrencylegno1: "",
    dealUnderlyingCurrencylegno2: "",
    dealNationalAmountlegno1: "",
    dealNationalAmountlegno2: "",
    dealAccuredInterest: 0,
    dealEffectiveDate: "",
    cleared: false,
    showQuickFlag: "",
  };

  initialState: any;
  resultRef: React.RefObject<Results> = React.createRef();

  componentDidMount() {
    this.initialState = this.state;
    if (this.props.txnType === "FX") {
      getCurrencyCrosses().then((res: any) => {
        const currencyResponse = res ? res : [];
        this.setState({ currencyCrosses: currencyResponse });
      });
    }
    this.setState({ dealCurrencyRatelegno1: "1.0" });
  }

  allowNumbersOnly = (event: { target: { name: any; value: any } }) => {
    this.setState({ showQuickFlag: event.target.name });
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  resetDealInfo() {
    this.setState(this.initialState);
  }

  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    let errorMsgs = [];
    let numericFields = [
      "dealNumberOfUnderlyingUnitslegno1",
      "dealNumberOfUnderlyingUnitslegno2",
      "dealUnderlyingPricelegno1",
      "dealUnderlyingPricelegno2",
      "dealCurrencyRatelegno1",
      "dealCurrencyRatelegno2",
      "dealNationalAmountlegno1",
      "dealNationalAmountlegno2",
    ];
    let actualNumericFieldNames = [
      "Number of Underlying Units Leg No 1",
      "Number of Underlying Units Leg No 2",
      "Underlying Price Leg No 1",
      "Underlying Price Leg No 2",
      "Currency Rate Leg No 1",
      "Currency Rate Leg No 2",
      "National Amount Leg No 1",
      "National Amount Leg No 2",
    ];
    let currentField = numericFields.indexOf(nam);
    if (currentField > -1 && Number(val) !== 0 && !Number(val)) {
      errorMsgs.push(
        actualNumericFieldNames[currentField] + " must be Numeric"
      );
      this.setState({ showAlert: true, alertMessage: errorMsgs });
      val = "";
    }
    this.setState({ [nam]: val });

    let nationalAmt1 =
      parseFloat(this.state.dealNumberOfUnderlyingUnitslegno1) *
      parseFloat(this.state.dealUnderlyingPricelegno1) *
      parseFloat(this.state.dealCurrencyRatelegno1);

    this.setState({
      dealNationalAmountlegno1: nationalAmt1,
    });
  };

  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Deal Information</legend>
        <div>
          <Table
            borderless={true}
            className="dealInfoTable"
            style={{
              display: this.props.txnType === "TRS" ? "" : "none",
              width: "50%",
            }}
          >
            <tbody>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Trade Date:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="date"
                    className="form-date-custom"
                    id="dealTradeDate"
                    name="dealTradeDate"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealTradeDate}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Value Date:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="date"
                    className="form-date-custom"
                    id="dealValueDate"
                    name="dealValueDate"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealValueDate}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd"></td>
                <td className="bondTd">
                  <b>Leg. No 1</b>
                </td>
                <td className="bondTd"></td>
                <td className="bondTd">
                  <b>Leg. No 2</b>
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Number of underlying Units:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealNumberOfUnderlyingUnitslegno1"
                    name="dealNumberOfUnderlyingUnitslegno1"
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.dealNumberOfUnderlyingUnitslegno1}
                  />
                  {this.state.showQuickFlag ===
                  "dealNumberOfUnderlyingUnitslegno1" ? (
                    <QuickKey
                      fieldName="dealNumberOfUnderlyingUnitslegno1"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Number of underlying Units:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealNumberOfUnderlyingUnitslegno2"
                    name="dealNumberOfUnderlyingUnitslegno2"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealNumberOfUnderlyingUnitslegno2}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Underlying Price:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealUnderlyingPricelegno1"
                    name="dealUnderlyingPricelegno1"
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.dealUnderlyingPricelegno1}
                  />
                  {this.state.showQuickFlag === "dealUnderlyingPricelegno1" ? (
                    <QuickKey
                      fieldName="dealUnderlyingPricelegno1"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Underlying Price:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealUnderlyingPricelegno2"
                    name="dealUnderlyingPricelegno2"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealUnderlyingPricelegno2}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Underlying Currency:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealUnderlyingCurrencylegno1"
                    name="dealUnderlyingCurrencylegno1"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealUnderlyingCurrencylegno1}
                    disabled
                  />
                </td>
                {"  "}
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Underlying Currency:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealUnderlyingCurrencylegno2"
                    name="dealUnderlyingCurrencylegno2"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealUnderlyingCurrencylegno2}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Currency:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealCurrencylegno1"
                    name="dealCurrencylegno1"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealCurrencylegno1}
                    disabled
                  />
                </td>
                {"  "}
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Currency:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealCurrencylegno2"
                    name="dealCurrencylegno2"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealCurrencylegno2}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Currency Rate:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealCurrencyRatelegno1"
                    name="dealCurrencyRatelegno1"
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.dealCurrencyRatelegno1}
                  />
                  {this.state.showQuickFlag === "dealCurrencyRatelegno1" ? (
                    <QuickKey
                      fieldName="dealCurrencyRatelegno1"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
                {"  "}
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Currency Rate:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealCurrencyRatelegno2"
                    name="dealCurrencyRatelegno2"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealCurrencyRatelegno2}
                    disabled
                  />
                  {this.state.showQuickFlag === "dealCurrencyRatelegno2" ? (
                    <QuickKey
                      fieldName="dealCurrencyRatelegno2"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
              <tr
                style={{
                  display:
                    this.props.otcIntrumenetType === "TRS IBOXX" &&
                    this.props.transactionCode === "Close"
                      ? ""
                      : "none",
                }}
              >
                <td className="bondTd"></td>
                <td className="bondTd"></td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Accrued Interest:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="number"
                    id="dealAccuredInterest"
                    name="dealAccuredInterest"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealAccuredInterest}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Notional Amount:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="dealNationalAmountlegno1"
                    name="dealNationalAmountlegno1"
                    onChange={this.numericChangeHandler}
                    value={
                      isNaN(parseFloat(this.state.dealNationalAmountlegno1))
                        ? 0
                        : this.state.dealNationalAmountlegno1
                    }
                    disabled
                  />
                </td>
                {"  "}
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Notional Amount:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    readOnly
                    type="text"
                    id="dealNationalAmountlegno2"
                    name="dealNationalAmountlegno2"
                    onChange={this.numericChangeHandler}
                    value={
                      isNaN(parseFloat(this.state.dealNationalAmountlegno2))
                        ? 0
                        : this.state.dealNationalAmountlegno2
                    }
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td
                  className="bondInstrumentTd"
                  style={{
                    display:
                      this.props.otcIntrumenetType === "TRS IBOXX" &&
                      this.props.transactionCode === "!Increase/Decrease"
                        ? ""
                        : "none",
                    padding: "0.15rem",
                  }}
                ></td>
                <td
                  className="bondInstrumentTd"
                  style={{
                    display:
                      this.props.otcIntrumenetType === "TRS IBOXX" &&
                      this.props.transactionCode === "!Increase/Decrease"
                        ? ""
                        : "none",
                    padding: "0.15rem",
                  }}
                ></td>
              </tr>
            </tbody>
          </Table>
          <Table
            borderless={true}
            className="dealInfoTable"
            style={{
              display: this.props.txnType === "IRS" ? "" : "none",
              width: "50%",
            }}
          >
            <tbody>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Trade Date:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="date"
                    id="dealTradeDate"
                    name="dealTradeDate"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealTradeDate}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Effective Date:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="date"
                    id="dealEffectiveDate"
                    name="dealEffectiveDate"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealEffectiveDate}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Cleared:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    className="confirmCheckbox"
                    type="checkbox"
                    id="dealcleared"
                    name="dealcleared"
                    checked={this.state.cleared}
                    onChange={(e) => {
                      var val = !this.state.cleared;
                      this.setState({
                        ...this.state,
                        cleared: val,
                      });
                    }}
                  ></Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
