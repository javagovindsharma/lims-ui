import React from "react";
import { Form, Table } from "react-bootstrap";
import { UserUtils } from "../../../lib/authenticationUtils";
import {
  initialPortfolio,
  initialSubPortfolio,
  Portfolio,
  SubPortfolio,
} from "../../../types/Transaction";
import {
  getPortfolioByAssetManager,
  getAssetManagers,
} from "./PortfolioService";

export default class PortfolioPage extends React.Component<{
  txnType: string;
  setAssetManager: any;
}> {
  public file!: File;
  state = {
    showAssetManager:
      UserUtils.getUser()?.assetManager === undefined ? true : false,
    portfolios: [],

    errors: [],
    portfolioShort: "",
    subPortfolios: [],
    subPortfolioShort: "",
    portfolioLei: "",
    portfolioshort: "",
    portfolioId: 0,
    assetManagers: [],
    assetManagerName: "",
  };
  initialPortfolioState: any;

  componentDidMount() {
    if (UserUtils.getUser()?.assetManager !== "") {
      getPortfolioByAssetManager(UserUtils.getUser()?.assetManager + "").then(
        (res) => {
          const portfolioResponse = res ? res : [];
          this.setState({
            portfolios: portfolioResponse,
          });
        }
      );
    }
    this.initialPortfolioState = this.state;
  }

  constructor(props: { txnType: string; setAssetManager: any }) {
    super(props);
    if (UserUtils.getUser()?.assetManager === "") {
      this.getAssetManagers();
    }
  }
  getAssetManagers() {
    getAssetManagers().then((res) => {
      const assetManagerResponse = res ? res : [];
      this.setState({ assetManagers: assetManagerResponse });
    });
  }

  assetManagerChangeHandler = (event: {
    target: { name: any; value: any };
  }) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });

    this.props.setAssetManager(val);
    getPortfolioByAssetManager(val).then((res) => {
      const portfolioResponse = res ? res : [];
      this.setState({
        portfolios: portfolioResponse,
      });
      if (portfolioResponse.length < 1) {
        this.setState({
          selectedPortfolio: {},
          portfolioName: "",
          portfolioShort: "",
          portfolioText: "",
          portfolioLei: "",
          portfolioshort: "",
          portfolioId: 0,
          subPortfolios: [],
        });
      }
    });
  };

  portfolioChageHandler = (event: any) => {
    let nam = event.target.name;
    let index = event.nativeEvent.target.selectedIndex;
    let portfolio: Portfolio =
      index > 0 ? this.state.portfolios[index - 1] : initialPortfolio;

    if (nam === "portfolioShort") {
      this.setState({
        selectedPortfolio: portfolio,
        portfolioName: portfolio.portfolioName,
        portfolioShort: portfolio.portfolioShort,
        portfolioText: portfolio.portfolioName,
        portfolioLei: portfolio.lei,
        portfolioshort: portfolio.portfolioShort,
        portfolioId: portfolio.portfolioId,
        subPortfolios: portfolio.subPortfolios,
      });
    }
  };
  subPortfolioChageHandler = (event: any) => {
    let nam = event.target.name;
    let index = event.nativeEvent.target.selectedIndex;
    let subPortfolios: SubPortfolio =
      index > 0 ? this.state.subPortfolios[index - 1] : initialSubPortfolio;
    if (nam === "subPortfolioShort") {
      this.setState({
        subPortfolioShort: subPortfolios.subPortfolioShort,
        subPortfolioName: subPortfolios.subPortfolioName,
      });
    }
  };

  resetPortfolio() {
    this.setState(this.initialPortfolioState);
  }

  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Portfolio</legend>
        <Table size="sm" borderless={true} style={{ width: "20%" }}>
          <tbody>
            {UserUtils.getUser()?.isSuperUser === true && (
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="behalf">On behalf of: </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {UserUtils.getUser()?.assetManager === "" ? (
                    <Form.Control
                      as="select"
                      size="sm"
                      className="portfolio"
                      name="assetManagerName"
                      onChange={this.assetManagerChangeHandler}
                      value={this.state.assetManagerName}
                      custom
                      style={{ minWidth: "fit-content" }}
                    >
                      <option value="0">Select Asset Manager</option>
                      {this.state.assetManagers.map((key: any) => {
                        return <option key={key}>{key}</option>;
                      })}
                    </Form.Control>
                  ) : (
                    <Form.Label>{UserUtils.getUser()?.assetManager}</Form.Label>
                  )}
                </td>
              </tr>
            )}
            {this.state.showAssetManager && (
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="behalf">On behalf of: </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="select"
                    custom
                    className="portfolio"
                    name="assetManagerName"
                    onChange={this.assetManagerChangeHandler}
                    value={this.state.assetManagerName}
                    style={{ minWidth: "fit-content" }}
                  >
                    <option value="0">Select Asset Manager</option>
                    {this.state.assetManagers.map((key: any) => {
                      return <option key={key}>{key}</option>;
                    })}
                  </Form.Control>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ padding: "0.15rem" }}>
                <Form.Label htmlFor="assetManager">Asset manager: </Form.Label>
              </td>
              <td style={{ padding: "0.15rem" }}>
                <Form.Label style={{ fontWeight: "bold" }}>
                  {this.state.assetManagerName === ""
                    ? UserUtils.getUser()?.assetManager
                    : this.state.assetManagerName}
                </Form.Label>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.15rem" }}>
                <Form.Label htmlFor="portfolioText">Portfolio: </Form.Label>
              </td>
              <td style={{ padding: "0.15rem" }}>
                <Form.Control
                  as="select"
                  custom
                  size="sm"
                  className="portfolio"
                  name="portfolioShort"
                  onChange={this.portfolioChageHandler}
                  value={this.state.portfolioShort}
                  style={{ minWidth: "fit-content" }}
                >
                  <option value="0">Select Portfolio</option>
                  {this.state.portfolios.map(
                    (key: Portfolio, index: number) => {
                      return <option key={index}>{key.portfolioShort}</option>;
                    }
                  )}
                </Form.Control>
              </td>
            </tr>
            <tr
              style={{
                display: this.state.portfolioShort.length > 1 ? "" : "none",
              }}
            >
              <td style={{ padding: "0.15rem" }}>
                <Form.Label htmlFor="subportfolioText">
                  Sub Portfolio:
                </Form.Label>
              </td>
              {this.state.subPortfolios.length > 0 && (
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="select"
                    custom
                    size="sm"
                    className="subportfolio"
                    name="subPortfolioShort"
                    onChange={this.subPortfolioChageHandler}
                    value={this.state.subPortfolioShort}
                    style={{ minWidth: "fit-content" }}
                  >
                    <option value="0">Select Sub Portfolio</option>
                    {this.state.subPortfolios.map((key: SubPortfolio) => {
                      return (
                        <option key={key.baseSysId}>
                          {key.subPortfolioShort}
                        </option>
                      );
                    })}
                  </Form.Control>
                </td>
              )}
              {this.state.subPortfolios.length === 0 && (
                <>No Sub Portfolios Available</>
              )}
            </tr>
            {this.state.portfolioId !== 0 && this.props.txnType === "EQUITY" && (
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Portfolio Short: </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>{this.state.portfolioshort}</Form.Label>
                </td>
              </tr>
            )}
            {this.state.portfolioId !== 0 && this.props.txnType === "EQUITY" && (
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Portfolio LEI: </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>{this.state.portfolioLei}</Form.Label>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </fieldset>
    );
  }
}
//  grid-template-columns: repeat(12, 1fr);
//grid-auto-rows: minmax(25px, auto);
