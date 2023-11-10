import React from "react";
import { Table, Form } from "react-bootstrap";

export default class OtcClearingReport extends React.Component<{
  txnType: string;
}> {
  state = {
    usinamespace: "",
    uniqueswapidentifier: "",
  };
  initialMisc: any;
  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  componentDidMount() {
    this.initialMisc = this.state;
  }

  resetOtc() {
    this.setState(this.initialMisc);
  }
  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">
          OTC Clearing &amp; Reporting
        </legend>
        <div>
          <Table borderless={true} style={{ width: "35%" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="USINamespace">USI Namespace:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "fit-content",
                    }}
                    type="text"
                    name="usinamespace"
                    id="usinamespace"
                    onChange={this.numericChangeHandler}
                    value={this.state.usinamespace}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <label htmlFor="fname">Unique swap identifier (USI):</label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "fit-content",
                    }}
                    type="text"
                    id="uniqueswapidentifier"
                    name="uniqueswapidentifier"
                    onChange={this.numericChangeHandler}
                    value={this.state.uniqueswapidentifier}
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
