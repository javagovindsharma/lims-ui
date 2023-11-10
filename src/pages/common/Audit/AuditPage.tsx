import React from "react";
import { Table, Form } from "react-bootstrap";
import { UserUtils } from "../../../lib/authenticationUtils";

export default class AuditPage extends React.Component {
  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Audit</legend>
        <div>
          <Table borderless={true}>
            <tbody>
              <tr>
                <td>
                  <Form.Label htmlFor="audit">
                    Created At: {new Date().toUTCString()} <br /> By:{" "}
                    <b>{UserUtils.getUser()?.userDisplayName}</b>
                  </Form.Label>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
