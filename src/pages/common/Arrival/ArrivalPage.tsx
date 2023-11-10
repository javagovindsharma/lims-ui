import React from "react";
import { Form, Table } from "react-bootstrap";
import { arrivalTimeZones } from "../../../helpers/constants";

export default class ArrivalPage extends React.Component<{}> {
  state = {
    arrivalPrice: "",
    arrivalPriceDateTime: "",
    arrivalTimeZone: ":00.000+10:00",
  };
  initialState: any;

  constructor(props: any) {
    super(props);
  }
  componentWillMount() {
    this.initialState = this.state;
  }

  resetArrival() {
    this.setState(this.initialState);
  }
  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Priips</legend>

        <div>
          <Table className="dealInfoTable" borderless style={{ width: "80%" }}>
            <tbody>
              <tr>
                <td>
                  <Form.Label>Arrival Price : </Form.Label>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="arrivalPrice"
                    id="arrivalPrice"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        arrivalPrice: e.target.value,
                      })
                    }
                    value={this.state.arrivalPrice}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Label>Arrival Price Date Time : </Form.Label>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="datetime-local"
                    name="arrivalPriceDateTime"
                    id="arrivalPriceDateTime"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        arrivalPriceDateTime: e.target.value,
                        arrivalTimeZone: ":00.000+10:00",
                      })
                    }
                    value={this.state.arrivalPriceDateTime}
                  />
                </td>
                <td>
                  <Form.Label>Time Zone</Form.Label>
                </td>
                <td>
                  <Form.Control
                    as="select"
                    size="sm"
                    value={this.state.arrivalTimeZone}
                    onChange={(event: any) => {
                      this.setState({
                        ...this.state,
                        arrivalTimeZone: event.target.value,
                      });
                    }}
                    custom
                    style={{ minWidth: "fit-content" }}
                  >
                    {arrivalTimeZones.map((timeZone: any) => {
                      return (
                        <option value={timeZone.value} key={timeZone.value}>
                          {timeZone.text}
                        </option>
                      );
                    })}
                  </Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </fieldset>
    );
  }
}
