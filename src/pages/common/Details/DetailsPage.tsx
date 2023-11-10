import React from "react";
import { Table, Form } from "react-bootstrap";
import QuickKey from "../Deal/QuickKey";
export default class DetailsPage extends React.Component<{
  txnType: string;
  type: any;
  otcIntrumenetType: string;
  transactionCode: string;
  parent: any;
}> {
  state = {
    fixedRate: "",
    index: "",
    daycount: "",
    initialRate: "",
    notional: "",
    maturityDate: "",
    frequency: "",
    tenor: "",
    spread: "",
    showQuickFlag: "",
  };
  initialState: any;
  resultRef: React.RefObject<QuickKey> = React.createRef();

  componentDidMount() {
    this.initialState = this.state;
  }
  allowNumbersOnly = (event: { target: { name: any; value: any } }) => {
    this.setState({ showQuickFlag: event.target.name });
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value });
    }
  };
  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    let errorMsgs = [];
    let numericFields = [
      "fixedRate",
      "index",
      "notional",
      "spread",
      "initialRate",
    ];
    let actualNumericFieldNames = [
      "Fixed Rate",
      "Index",
      "Notional",
      "Spread",
      "Initial Rate",
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
  };

  resetDeatils() {
    this.setState(this.initialState);
  }

  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Details</legend>
        <div>
          <Table
            className="dealInfoTable"
            borderless={true}
            style={{ width: "70%" }}
          >
            <tbody>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  {" "}
                  <b>Leg. No. 1</b>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  {" "}
                  <b>Pay/Receive</b>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  {" "}
                  <b>Fixed/Floating</b>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <b>Leg. No. 2</b>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <b>Pay/Receive</b>
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Fixed Rate(%):</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    type="text"
                    custom
                    size="sm"
                    id="fixedRate"
                    name="fixedRate"
                    onChange={this.numericChangeHandler}
                    disabled
                    value={this.state.fixedRate}
                  />
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}></td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Index:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="index"
                    name="index"
                    onChange={this.numericChangeHandler}
                    disabled
                    value={this.state.index}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Frequency:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="frequency"
                    name="frequency"
                    onChange={this.numericChangeHandler}
                    disabled
                    value={this.state.frequency}
                  />
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}></td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Tenor:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    type="text"
                    custom
                    size="sm"
                    id="tenor"
                    name="tenor"
                    onChange={this.numericChangeHandler}
                    disabled
                    value={this.state.tenor}
                  />
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Maturity Date:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    style={{ width: "69%" }}
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    onChange={this.numericChangeHandler}
                    value={this.state.maturityDate}
                  />
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}></td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Spread:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="spread"
                    name="spread"
                    style={{ width: "67%" }}
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.spread}
                  />
                  {this.state.showQuickFlag === "spread" ? (
                    <QuickKey
                      fieldName="spread"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Notional:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{ width: "69%" }}
                    size="sm"
                    type="text"
                    id="notional"
                    name="notional"
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.notional}
                  />
                  {this.state.showQuickFlag === "notional" ? (
                    <QuickKey
                      fieldName="notional"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}></td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Initial Rate:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{ width: "67%" }}
                    size="sm"
                    type="text"
                    id="initialRate"
                    name="initialRate"
                    onChange={(event) => {
                      this.numericChangeHandler(event);
                      this.allowNumbersOnly(event);
                    }}
                    value={this.state.initialRate}
                  />
                  {this.state.showQuickFlag === "initialRate" ? (
                    <QuickKey
                      fieldName="initialRate"
                      ref={this.resultRef}
                      parent={this}
                    />
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
              <tr>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Label>Day Count:</Form.Label>
                </td>
                <td className="bondTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    custom
                    size="sm"
                    type="text"
                    id="daycount"
                    name="daycount"
                    onChange={this.numericChangeHandler}
                    disabled
                    value={this.state.daycount}
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
