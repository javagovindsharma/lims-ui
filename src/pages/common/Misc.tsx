import React from "react";
import { Table, Form } from "react-bootstrap";

export default class MiscPage extends React.Component<{
  txnType: string;
  transactionCode?: string;
}> {
  state = {
    comments: "",
    externalTradeId: "",
    uti: "",
    managerUniqueSwapId: "",
    admincomments: "",
    bloombergId: "",
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

  resetMisc() {
    this.setState(this.initialMisc);
  }
  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Misc</legend>
        <div>
          <Table borderless={true} style={{ width: "37%" }}>
            <tbody>
              {this.props.txnType === "TRS" && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="ManagerUniqueSwapID">
                      Position ID:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "fit-content",
                      }}
                      name="managerUniqueSwapId"
                      id="managerUniqueSwapId"
                      onChange={this.numericChangeHandler}
                      value={this.state.managerUniqueSwapId}
                    />
                  </td>
                </tr>
              )}
              {this.props.txnType === "CDI" && (
                <tr>
                  <td>
                    <label htmlFor="bloombergId">Bloomberg ID</label>
                  </td>
                  <td>
                    <input
                      name="bloombergId"
                      id="bloombergId"
                      onChange={this.numericChangeHandler}
                      value={this.state.bloombergId}
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="comments">Comments:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="comments"
                    id="comments"
                    onChange={this.numericChangeHandler}
                    value={this.state.comments}
                  />
                </td>
              </tr>
              {(this.props.txnType === "TRS" ||
                this.props.txnType === "IRS" ||
                this.props.txnType === "DEPOSIT" ||
                this.props.txnType === "REPOS" ||
                this.props.txnType === "CDI" ||
                this.props.txnType === "CDS") && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="admincomments">
                      Admin Comments:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "fit-content",
                      }}
                      name="admincomments"
                      id="admincomments"
                      onChange={this.numericChangeHandler}
                      value={this.state.admincomments}
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="fname">External Trade ID:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "fit-content",
                    }}
                    type="text"
                    id="externalTradeId"
                    name="externalTradeId"
                    onChange={this.numericChangeHandler}
                    value={this.state.externalTradeId}
                  />
                </td>
              </tr>
              {(this.props.txnType === "BOND" ||
                this.props.txnType === "EQUITY" ||
                this.props.txnType === "FUTURE" ||
                this.props.txnType === "OPTION" ||
                this.props.txnType === "DEPOSIT" ||
                this.props.txnType === "REPOS") && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="uti">UTI:</Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "fit-content",
                      }}
                      type="text"
                      id="uti"
                      name="uti"
                      onChange={this.numericChangeHandler}
                      value={this.state.uti}
                    />
                  </td>
                </tr>
              )}
              {(this.props.txnType === "CFD" ||
                this.props.txnType === "OPTION" ||
                this.props.txnType === "FUTURE") && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    {" "}
                    <Form.Label>Auto Confirm</Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      style={{
                        minWidth: "-webkit-fill-available",
                        height: "15px",
                        width: "60%",
                      }}
                      className="confirmCheckbox"
                      type="checkbox"
                      name="autoConfirmBox"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
