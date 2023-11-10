import React from "react";
import { Table, Form } from "react-bootstrap";
import QuickKey from "./../Deal/QuickKey";
import Results from "./../Deal/QuickKey";
import {
  fetchOpenPositionById,
  getOpenPositionInstrument,
  getUnderlyingSecurity,
  listOpenPosition,
} from "./OpenPositionService";

export default class OpenPosition extends React.Component<{
  otcIntrumenetType: string;
  transactionCode: string;
  asssetManager: string;
  parent: any;
  deals: any;
}> {
  state: any = {
    trs_transactionCode: "",
    trs_securityId: "",
    trs_ManagerUniqSwapId: "",
    trs_NoOfUnderlyingUnits: "",
    trs_securityName: "",
    trs_NationalAmount: "",
    trs_positionSwapId: "",
    posasssetManager: "",
    positionIds: [],
    novation: false,
    showQuickFlag: "",
  };
  initialOpenPositionState: any;
  resultRef: React.RefObject<Results> = React.createRef();

  componentDidMount() {
    this.initialOpenPositionState = this.state;
  }

  componentDidUpdate() {
    if (
      this.props.asssetManager !== this.state.posasssetManager &&
      this.props.asssetManager !== ""
    ) {
      this.listOpenPositions(this.props.asssetManager);
    }
  }

  resetOpenPosition() {
    this.setState(this.initialOpenPositionState);
  }

  listOpenPositions = (assetManager: any) => {
    let otcInstrumentType = "";
    if (this.props.otcIntrumenetType === "TRS") {
      otcInstrumentType = "E-TRS";
    } else {
      otcInstrumentType = "FI-IBXTRS";
    }

    if (this.props.asssetManager.length > 0) {
      this.setState({ posasssetManager: this.props.asssetManager });
    }
    listOpenPosition(otcInstrumentType, assetManager).then((res) => {
      const positionResponse = res ? res : [];
      this.setState({
        positionIds: positionResponse,
      });
    });
  };
  underlyingSecurity = () => {
    getUnderlyingSecurity(this.state.otcIntrumenetType).then((res) => {
      const portfolioResponse = res ? res : [];
      console.log(portfolioResponse);
      this.setState({
        portfolios: portfolioResponse,
      });
    });
  };
  openPositionsById = (event: { target: { name: any; value: any } }) => {
    var id = event.target.value;
    fetchOpenPositionById(event.target?.value).then((res) => {
      var positionResponse = res ? res : {};
      this.setState({
        trs_positionSwapId: id,
      });
      if (Object.keys(positionResponse).length !== 0) {
        this.setInstrumentData(positionResponse);
        this.setOpenPositionData(positionResponse);
        this.setPortfolioData(positionResponse);
        this.setCounterPartyData(positionResponse);
        this.setDealsData(positionResponse);
        this.setDeatilsData(positionResponse);
      } else {
        positionResponse = {
          transoriginNo: "",
          customerId: "",
          transactionType: "",
          assetMgr: "",
          staticRequested: false,
          transferred: false,
          deleted: false,
          confirmed: false,
          action: "",
          fileName: "",
          valueDate: "",
          transactionCode: "",
          comments: "",
          maturityDate: "",
          tradeDate: "",
          price: "",
          firstValuationDate: "",
          initialValuationDate: "",
          createdDate: "",
          authorCreated: "",
          modifiedDate: "",
          portfolioShort: "",
          portfolioName: "",
          subPortfolioName: "",
          counterpartyName: "",
          counterpartyShort: "",
          counterpartyBicCode: "",
          sedol: "",
          instrumentShort: "",
          instrumentName: "",
          instrumentType: "",
          currency: "",
          bloombergId: "",
          inverted: false,
          exportConfigurationId: 0,
          importConfigurationId: 0,
          positionId: "",
          noOfUnderlyingUnits: "",
          currencyLeg1: "",
          currencyLeg2: "",
          daycountLeg1: "",
          daycountLeg2: "",
          frequencyLeg1: "",
          frequencyLeg2: "",
          paidReceivedLeg1: "",
          paidReceivedLeg2: "",
          rateType: "",
          refRate: "",
          otcInstrumentId: "",
          otcInstrumentName: "",
          otcInstrumentNumber: "",
          otcInstrumentType: "",
        };
        this.setInstrumentData(positionResponse);
        this.setOpenPositionData(positionResponse);
        this.setPortfolioData(positionResponse);
        this.setCounterPartyData(positionResponse);
        this.setDealsData(positionResponse);
        this.setDeatilsData(positionResponse);
      }
    });
  };

  setInstrumentData(positionResponse: any) {
    this.props.parent.setState({
      otcInstrumentId: positionResponse.otcInstrumentId,
      otcInstrumentName: positionResponse.otcInstrumentName,
    });
  }

  setOpenPositionData(positionResponse: any) {
    this.setState({
      trs_NoOfUnderlyingUnits: positionResponse.noOfUnderlyingUnits,
      trs_NationalAmount: positionResponse.notionalAmount,
    });
  }

  setPortfolioData(positionResponse: any) {
    this.props.parent.trsPortfolioRef?.current?.setState({
      portfolioName: positionResponse.portfolioName,
      portfolioShort: positionResponse.portfolioShort,
      subPortfoliosLength: -3,
      subPortfolioShort: positionResponse.subPortfolioName,
    });
  }

  setCounterPartyData(positionResponse: any) {
    this.props.parent.counterpartyRef?.current?.setState({
      counterpartyName: positionResponse.counterpartyName,
      counterpartyShort: positionResponse.counterpartyShort,
      counterpartyBicCode: positionResponse.counterpartyBicCode,
    });
  }
  setDealsData(positionResponse: any) {
    this.props.parent.trsDealInformationRef?.current?.setState({
      dealTradeDate: positionResponse.tradeDate.slice(0, 10),
      dealValueDate: positionResponse.valueDate.slice(0, 10),
      dealNumberOfUnderlyingUnitslegno1: positionResponse.noOfUnderlyingUnits,
      dealUnderlyingPricelegno1: positionResponse.price,
      dealUnderlyingCurrencylegno1: positionResponse.currencyLeg1,
      dealCurrencylegno1: positionResponse.currencyLeg1,
      dealNationalAmountlegno1: positionResponse.notionalAmount,
    });
  }

  setDeatilsData(positionResponse: any) {
    this.props.parent.swapDescriptionRef?.current?.setState({
      swapDayCountlegno1: positionResponse.daycountLeg1,
      swapDayCountlegno2: positionResponse.daycountLeg2,
      swapFrequencylegno1: positionResponse.frequencyLeg1,
      swapFrequencylegno2: positionResponse.frequencyLeg2,
      swapCurrencylegno1: positionResponse.currencyLeg1,
      swapCurrencylegno2: positionResponse.currencyLeg2,
      swapPayReceiveCurrencylegno1: positionResponse.paidReceivedLeg1,
      swapPayReceiveCurrencylegno2: positionResponse.paidReceivedLeg2,
      swapRateTypeleg: positionResponse.rateType,
      underlyingSecType: positionResponse.instrumentType,
      swapSpreadRateleg: positionResponse.spreadRate,
      swapUnderlyingSecCurrency: positionResponse.currency,
      swapReferenceRateleg: positionResponse.refRate,
      underlyingInstrumentSedol: positionResponse.sedol,
      underlyingInstrumentBloombergId: positionResponse.bloombergId,
      underlyingInstrumentName: positionResponse.instrumentName,
      underlyingInstrumentShort: positionResponse.instrumentShort,
      swapUnderlyingSecIdentifier: positionResponse.instrumentName,
      swapFinalValuationMaturityDate: positionResponse.maturityDate.slice(
        0,
        10
      ),
      swapStartValuation: positionResponse.initialValuationDate.slice(0, 10),
      swapFirstValuation: positionResponse.firstValuationDate.slice(0, 10),
    });
  }

  allowNumbersOnly = (event: { target: { name: any; value: any } }) => {
    this.setState({ showQuickFlag: event.target.name });
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target?.name;
    let val = event.target?.value;
    let errorMsgs = [];
    let numericFields = ["trs_securityId"];
    let actualNumericFieldNames = ["Security Id"];
    //numericFields = []; //done to avoid calculation as formula not provided for FX
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

  render() {
    return (
      <div
        style={{ display: this.props.transactionCode !== "Open" ? "" : "none" }}
      >
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Open Positions</legend>
          <div>
            <Table
              className="dealInfoTable"
              borderless={true}
              style={{ width: "50%" }}
            >
              <tbody>
                <tr
                  style={{
                    display:
                      (this.props.otcIntrumenetType === "TRS" ||
                        this.props.otcIntrumenetType === "TRS IBOXX") &&
                      this.props.transactionCode != "New"
                        ? ""
                        : "none",
                  }}
                >
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label>PositionID:</Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      as="select"
                      custom
                      size="sm"
                      name="trs_positionSwapId"
                      id="trs_positionSwapId"
                      value={this.state.trs_positionSwapId}
                      onChange={this.openPositionsById}
                    >
                      <option value="" disabled>
                        Select an Position Id
                      </option>
                      {this.state.positionIds.map((key: any) => {
                        return (
                          <option key={key["positionId"]}>
                            {key["positionId"]}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </td>

                  <td
                    style={{
                      display:
                        this.props.otcIntrumenetType === "TRS IBOXX" &&
                        (this.props.transactionCode === "Decrease" ||
                          this.props.transactionCode === "Close")
                          ? ""
                          : "none",
                      padding: "0.15rem",
                    }}
                  >
                    <Form.Control
                      size="sm"
                      custom
                      className="confirmCheckbox"
                      type="checkbox"
                      name="novation"
                      checked={this.state.novation}
                      onChange={(e) => {
                        var val = !this.state.novation;
                        this.setState({
                          ...this.state,
                          novation: val,
                        });
                        this.props.parent?.setState({
                          ...this.props.parent?.state,
                          novation: val,
                        });
                      }}
                    ></Form.Control>
                    <Form.Label>Novation</Form.Label>
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
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="trs_securityId">
                      Security ID:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      type="text"
                      id="trs_securityId"
                      name="trs_securityId"
                      value={this.state.trs_securityId}
                      onChange={this.numericChangeHandler}
                    />
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
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="trs_securityName">
                      Security Name:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      type="text"
                      id="trs_securityName"
                      name="trs_securityName"
                      value={this.state.trs_securityName}
                      onChange={this.numericChangeHandler}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="trs_NoOfUnderlyingUnits">
                      No of Underlying Units:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      readOnly
                      type="text"
                      id="trs_NoOfUnderlyingUnits"
                      name="trs_NoOfUnderlyingUnits"
                      value={this.state.trs_NoOfUnderlyingUnits}
                      onChange={(event) => {
                        this.numericChangeHandler(event);
                        this.allowNumbersOnly(event);
                      }}
                    />
                    {this.state.showQuickFlag === "dealFee1" ? (
                      <QuickKey
                        fieldName="dealFee1"
                        ref={this.resultRef}
                        parent={this}
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Label htmlFor="trs_NationalAmount">
                      National Amount:
                    </Form.Label>
                  </td>
                  <td style={{ padding: "0.15rem" }}>
                    <Form.Control
                      size="sm"
                      readOnly
                      type="text"
                      id="trs_NationalAmount"
                      name="trs_NationalAmount"
                      value={this.state.trs_NationalAmount}
                      onChange={this.numericChangeHandler}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </fieldset>
      </div>
    );
  }
}
