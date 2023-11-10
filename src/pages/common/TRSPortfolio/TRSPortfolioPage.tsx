import React from "react";
import { Table, Form } from "react-bootstrap";
import { UserUtils } from "../../../lib/authenticationUtils";
import {
  initialPortfolio,
  initialSubPortfolio,
  Portfolio,
  SubPortfolio,
} from "../../../types/Transaction";
import { getPortfolioByAssetManager } from "../Portfolio/PortfolioService";

export default class TRSPortfolioPage extends React.Component<{
  txnType: string;
  assetManagerType: string;
  transactionCode: string;
}> {
  public file!: File;
  state = {
    showAssetManager:
      UserUtils.getUser()?.assetManager === undefined ? true : false,
    portfolios: [],

    errors: [],
    portfolioShort: "",
    portfolioName: "",
    subPortfolios: [],
    subPortfolioShort: "",
    portfolioLei: "",
    portfolioId: 0,
    assetManagers: [],
    assetManagerName: "",
    subPortfoliosLength: 0,
  };
  initialPortfolioState: any;

  componentDidMount() {
    if (UserUtils.getUser()?.assetManager !== "") {
      this.loadPortfolios(UserUtils.getUser()?.assetManager);
    }
    this.initialPortfolioState = this.state;
  }

  constructor(props: {
    txnType: string;
    assetManagerType: any;
    transactionCode: string;
  }) {
    super(props);
  }

  loadPortfolios(assetMgr: any) {
    getPortfolioByAssetManager(assetMgr + "").then((res) => {
      const portfolioResponse = res ? res : [];
      console.log(portfolioResponse);
      this.setState({
        portfolios: portfolioResponse,
      });
    });
  }

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
    this.setState({
      portfolioShort: "",
      portfolioName: "",
      subPortfolioShort: "",
      portfolioLei: "",
      portfolioId: 0,
      assetManagerName: "",
      subPortfoliosLength: 0,
    });
  }

  render() {
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Portfolio</legend>
        <div>
          <Table
            className="dealInfoTable"
            borderless={true}
            style={{ width: "30%" }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="portfolioText">Portfolio:</Form.Label>
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
                    disabled={
                      this.props.transactionCode !== "New" &&
                      this.props.txnType === "TRS"
                    }
                  >
                    <option value="0">Select Portfolio</option>
                    {this.state.portfolios.map(
                      (key: Portfolio, index: number) => {
                        return (
                          <option key={index}>{key.portfolioShort}</option>
                        );
                      }
                    )}
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label htmlFor="portfolioText">
                    Portfolio Name:
                  </Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="portfolioName"
                    name="portfolioName"
                    value={this.state.portfolioName}
                    readOnly
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: this.state.portfolioShort?.length > 1 ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>
                  <label htmlFor="subportfolioText">Sub Portfolio:</label>
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
                      disabled={
                        this.props.transactionCode !== "New" &&
                        this.props.txnType === "TRS"
                      }
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
                {this.state.subPortfoliosLength === -3 && (
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      type="text"
                      id="portfolioName"
                      name="portfolioName"
                      value={this.state.subPortfolioShort}
                      readOnly
                    />
                  </td>
                )}
                {this.state.subPortfolios.length === 0 &&
                  this.state.subPortfoliosLength === 0 && (
                    <>No Sub Portfolios Available</>
                  )}
              </tr>
              {this.state.portfolioId !== 0 && this.props.txnType === "EQUITY" && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>Portfolio Short</Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>{this.state.subPortfolioShort}</Form.Label>
                  </td>
                </tr>
              )}
              {this.state.portfolioId !== 0 && this.props.txnType === "EQUITY" && (
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>Portfolio LEI</Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>{this.state.portfolioLei}</Form.Label>
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
