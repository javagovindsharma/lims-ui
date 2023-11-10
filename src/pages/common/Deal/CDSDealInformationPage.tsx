import React from "react";
import { Table, Form, FormControl, ListGroup } from "react-bootstrap";
import { isConstructorDeclaration } from "typescript";
import { ihubConstants } from "../../../helpers/constants";
import { getOTCInstrumentsCDS, loadOtcCurrencies } from "../Deal/DealService";

export default class CDSDealInformationPage extends React.Component<{
  txnCode: string;
  otcIntrumenetType: string;
  parent: any;
}> {
  state = {
    //deal information fields
    dealCouponRate: "",

    dealFaceValue: "",
    dealPoolFactor: "",
    dealQuoteFactor: "",
    dealPrice: "",
    dealYield: "",
    dealAccruedInterest: "",
    dealCleanValue: "",
    dealSettlementCurrency: "",
    dealPriceCurrency: "",
    dealquoteCurrency: "",

    dealValueDate: "",

    dealQuantity: "",
    dealFee2: "",
    dealFee3: "",
    dealCommission: "",
    dealOtherFee: "",
    dealTax: "",
    dealPaymentAmount: "",
    dealSettlementAmount: "",

    dealPriceOrYield: "",
    dealContractSize: "",
    dealQuoteAmount: "",
    dealCLS: "",
    dealCurrencyPair: "",
    dealFXType: "",
    dealSpotRate: "",
    dealTics: "",
    dealForwardRate: "",
    dealBaseAmount: "",
    dealBaseCurrency: "",
    //option
    dealOpenClose: "",
    dealLots: 0,
    //for FXSwap
    dealBaseCurrencyAmountSpot: "",
    dealBaseCurrencyAmountForward: "",
    dealPriceCurrencyAmountSpot: "",
    dealPriceCurrencyAmountForward: "",

    errors: {
      dealQuoteFactor: "",
      dealPrice: "",
    },
    bondTypeABSorMBS: true,
    poolFactorValues: [0, 1],
    showFlag: "",
    currencyCrosses: [],
    isFXSwap: false,

    //CDS deals
    dealTransactionCode: "",
    dealTradeDate: "",
    dealMaturityDate: "",
    dealNominal: "",
    dealIndexes: [
      {
        id: 0,
        instrumentShort: "",
        instrumentName: "",
        isin: "",
        currency: "",
        index: "",
        indexTenor: "",
        instrumentType: "",
        rateType: "",
        refRate: "",
        otcInstrumentId: "",
        otcInstrumentName: "",
        otcInstrumentNumber: "",
        otcInstrumentType: "",
        otcInstrumentCurrency: "",
        quoteType: "",
        markitTicker: "",
        referenceEntity: "",
        referenceEntityName: "",
        seniority: "",
        isdaTransType: "",
        fee: "",
      },
    ],
    dealOTCInstrumentShort: "",
    dealOTCInstrumentName: "",
    dealOTCInstrumentId: "",
    dealIndex: "",
    dealFee1: "",
    dealNotionalAmount: "",
    dealCurrency: "",
    dealQuoteType: "",
    dealCleared: "",
    dealIsin: "",
    dealPairRED: "",
    dealIsinTransType: "",
    dealReferenceEntityName: "",
    dealMarkitTicker: "",
    dealSeniority: "",
    dealContractDefinition: "ISDA 2003 Credit",
    dealTenor: "",
    dealSpreadBps: "",
    dealIndexesCurrencies: [
      {
        id: 0,
        customerId: 0,
        isdaTransType: "",
        isdaCurrency: "",
        isdaFeeRateBp: 0,
      },
    ],
    activeInstrumentOption: 0,
    filteredInstrumentOptions: [],
    activeCDIInstrumentOption: 0,
    filteredCDIInstrumentOptions: [],
    typeAheadFailCount: 0,
    showInstrument: false,
    showCDIInstrument: false,
    instrumentSearching: false,
  };
  initialState: any;

  componentDidMount() {
    this.initialState = this.state;
  }

  resetDealInfo() {
    this.setState(this.initialState);
  }

  loadOtcInstruments(transactionCode: string, key: string) {
    getOTCInstrumentsCDS(transactionCode.toLocaleLowerCase(), key).then(
      (res) => {
        this.setState({
          ...this.state,
          dealIndexes: res,
          instrumentSearching: false,
        });
      }
    );
  }

  onInstrumentClick = (e: any) => {
    // alert(currentinstrument.isin);
    console.log(e);
    const { activeInstrumentOption, filteredInstrumentOptions } = this.state;
    var currentinstrument = this.state.dealIndexes[activeInstrumentOption];
    this.setState({
      activeInstrumentOption: 0,
      showInstrument: false,
      dealPairRED: currentinstrument?.instrumentShort,
      dealIsin: currentinstrument?.isin,
      dealIsinTransType: currentinstrument?.isdaTransType,
      dealReferenceEntityName: currentinstrument?.referenceEntityName,
      dealMarkitTicker: currentinstrument?.markitTicker,
      dealSeniority: currentinstrument?.seniority,
    });
    loadOtcCurrencies(currentinstrument?.isdaTransType).then((res) => {
      console.log(res);
      this.setState({ dealIndexesCurrencies: res ? res : [] });
    });
  };

  onInstrumentKeyDown = (e: { keyCode: number }) => {
    const { activeInstrumentOption, filteredInstrumentOptions } = this.state;
    var currentinstrument = this.state.dealIndexes[activeInstrumentOption];
    if (e.keyCode === ihubConstants.enter_key_code.value) {
      this.setState({
        activeInstrumentOption: 0,
        showInstrument: false,
        dealPairRED: currentinstrument?.instrumentShort,
        dealIsin: currentinstrument?.isin,
        dealIsinTransType: currentinstrument?.isdaTransType,
        dealReferenceEntityName: currentinstrument?.referenceEntityName,
        dealMarkitTicker: currentinstrument?.markitTicker,
        dealSeniority: currentinstrument?.seniority,
      });
      loadOtcCurrencies(currentinstrument?.isdaTransType).then((res) =>
        this.setState({ dealIndexesCurrencies: res ? res : [] })
      );
    } else if (e.keyCode === ihubConstants.up_arrow_code.value) {
      if (activeInstrumentOption === 0) {
        return;
      }
      this.setState({ activeInstrumentOption: activeInstrumentOption - 1 });
    } else if (e.keyCode === ihubConstants.down_arrow_code.value) {
      if (activeInstrumentOption === this.state.dealIndexes.length - 1) {
        return;
      }
      this.setState({ activeInstrumentOption: activeInstrumentOption + 1 });
    }
  };

  onCDIInstrumentClick = (e: any) => {
    // alert(currentinstrument.isin);
    console.log(e);
    const { activeCDIInstrumentOption } = this.state;
    var currentinstrument = this.state.dealIndexes[activeCDIInstrumentOption];
    this.setState({
      activeCDIInstrumentOption: 0,
      showCDIInstrument: false,
      dealOTCInstrumentName: currentinstrument?.otcInstrumentName,
      dealOTCInstrumentShort: currentinstrument?.instrumentShort,
      dealIndex: currentinstrument?.index,
      dealCurrency: currentinstrument?.otcInstrumentCurrency,
      dealFee1: currentinstrument?.fee,
      dealOTCInstrumentId: currentinstrument?.otcInstrumentId,
    });
  };

  onCDIInstrumentKeyDown = (e: { keyCode: number }) => {
    const { activeCDIInstrumentOption } = this.state;
    var currentinstrument = this.state.dealIndexes[activeCDIInstrumentOption];
    if (e.keyCode === ihubConstants.enter_key_code.value) {
      this.setState({
        activeCDIInstrumentOption: 0,
        showCDIInstrument: false,
        dealOTCInstrumentName: currentinstrument?.otcInstrumentName,
        dealOTCInstrumentShort: currentinstrument?.instrumentShort,
        dealIndex: currentinstrument?.index,
        dealCurrency: currentinstrument?.otcInstrumentCurrency,
        dealFee1: currentinstrument?.fee,
        dealOTCInstrumentId: currentinstrument?.otcInstrumentId,
      });
    } else if (e.keyCode === ihubConstants.up_arrow_code.value) {
      if (activeCDIInstrumentOption === 0) {
        return;
      }
      this.setState({
        activeCDIInstrumentOption: activeCDIInstrumentOption - 1,
      });
    } else if (e.keyCode === ihubConstants.down_arrow_code.value) {
      if (activeCDIInstrumentOption === this.state.dealIndexes.length - 1) {
        return;
      }
      this.setState({ activeInstrumentOption: activeCDIInstrumentOption + 1 });
    }
  };

  render() {
    let instrumentSearchList;
    if (this.state.showInstrument) {
      if (this.state.dealIndexes.length != 0 && this.state.dealPairRED) {
        instrumentSearchList = (
          <ListGroup as="ul" className="options">
            {this.state.dealIndexes.map(
              (optionName: any, index: React.Key | undefined) => {
                let className;
                if (index === this.state.activeInstrumentOption) {
                  className = "style-option-active";
                }
                return (
                  <ListGroup.Item
                    as="li"
                    className={className}
                    key={index}
                    onClick={this.onInstrumentClick}
                    onMouseEnter={() => {
                      this.setState({ activeInstrumentOption: index });
                    }}
                  >
                    {optionName?.instrumentShort}
                  </ListGroup.Item>
                );
              }
            )}
          </ListGroup>
        );
      } else {
        instrumentSearchList = (
          <div className="no-options">
            <em>
              {this.state.instrumentSearching ? "Searching" : "No Option"}
            </em>
          </div>
        );
      }
    } else {
      <></>;
    }
    let CDIinstrumentSearchList;
    if (this.state.showCDIInstrument) {
      if (this.state.dealIndexes.length != 0 && this.state.dealPairRED) {
        CDIinstrumentSearchList = (
          <ListGroup as="ul" className="options">
            {this.state.dealIndexes.map(
              (optionName: any, index: React.Key | undefined) => {
                let className;
                if (index === this.state.activeInstrumentOption) {
                  className = "style-option-active";
                }
                return (
                  <ListGroup.Item
                    as="li"
                    className={className}
                    key={index}
                    onClick={this.onCDIInstrumentClick}
                    onMouseEnter={() => {
                      this.setState({ activeCDIInstrumentOption: index });
                    }}
                  >
                    {optionName?.otcInstrumentName}
                  </ListGroup.Item>
                );
              }
            )}
          </ListGroup>
        );
      } else {
        CDIinstrumentSearchList = (
          <div className="no-options">
            <em>
              {this.state.instrumentSearching ? "Searching" : "No Option"}
            </em>
          </div>
        );
      }
    } else {
      <></>;
    }
    return (
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Deal Information</legend>
        <div>
          <Table
            className="dealInfoTable"
            borderless
            style={{
              width: this.props.otcIntrumenetType === "CDI" ? "35%" : "80%",
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Transaction Code:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="select"
                    size="sm"
                    custom
                    name="dealTransactionCode"
                    id="dealTransactionCode"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealTransactionCode: e.target.value,
                      })
                    }
                  >
                    <option id="option0" disabled selected>
                      Select an Transaction Code
                    </option>
                    <option id="option1" value="Buy">
                      Buy
                    </option>
                    <option id="option2" value="Sell">
                      Sell
                    </option>
                  </Form.Control>
                </td>
              </tr>{" "}
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Trade Date:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="date"
                    id="dealTradeDate"
                    name="dealTradeDate"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealTradeDate: e.target.value,
                      })
                    }
                    value={this.state.dealTradeDate}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDI" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Index Id</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    type="text"
                    size="sm"
                    style={{ minWidth: "fit-content" }}
                    name="dealTransactionCode"
                    id="dealTransactionCode"
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        dealPairRED: e.target.value,
                      });
                      if (e.target.value.length > 2) {
                        this.setState({ showCDIInstrument: true });
                        this.loadOtcInstruments("CDI", e.target.value);
                      }
                    }}
                    onKeyDown={this.onCDIInstrumentKeyDown}
                  >
                    {/* <option id="option0" disabled selected>
                      Select an Index
                    </option>
                    {this.state.dealIndexes.map((instrument: any) => (
                      <option id="option1" value={instrument.otcInstrumentName}>
                        {instrument.otcInstrumentName}
                      </option>
                    ))} */}
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}></td>
                <td style={{ padding: "0.15rem" }}>
                  {CDIinstrumentSearchList}
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDS" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>PairRED</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealPairRED"
                    name="dealPairRED"
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        dealPairRED: e.target.value,
                      });
                      if (e.target.value.length > 2) {
                        this.setState({ showInstrument: true });
                        this.loadOtcInstruments("CDS", e.target.value);
                      }
                    }}
                    onKeyDown={this.onInstrumentKeyDown}
                    value={this.state.dealPairRED}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>ISIN</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealIsin"
                    name="dealIsin"
                    disabled
                    value={this.state.dealIsin}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Label>ISIN Trans Type</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealIsinTransType"
                    name="dealIsinTransType"
                    disabled
                    value={this.state.dealIsinTransType}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}></td>
                <td style={{ padding: "0.15rem" }}>{instrumentSearchList}</td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDS" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Reference Entity Name</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealReferenceEntityName"
                    name="dealReferenceEntityName"
                    disabled
                    value={this.state.dealReferenceEntityName}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Markit Ticker</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealMarkitTicker"
                    name="dealMarkitTicker"
                    disabled
                    value={this.state.dealMarkitTicker}
                  />
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Seniority</Form.Label>{" "}
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealSeniority"
                    name="dealSeniority"
                    disabled
                    value={this.state.dealSeniority}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDS" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>Contract Definition</td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    as="select"
                    size="sm"
                    id="dealContractDefinition"
                    name="dealContractDefinition"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealContractDefinition: e.target.value,
                      })
                    }
                    value={this.state.dealContractDefinition}
                  >
                    <option value="ISDA 2014 Credit">ISDA 2014 Credit</option>
                    <option value="ISDA 2003 Credit">ISDA 2003 Credit</option>
                  </Form.Control>
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDS" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>Tenor</td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    as="select"
                    size="sm"
                    id="dealTenor"
                    name="dealTenor"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealTenor: e.target.value,
                      })
                    }
                    value={this.state.dealTenor}
                  >
                    <option value="3Y">3Y</option>
                    <option value="5Y">5Y</option>
                    <option value="7Y">7Y</option>
                    <option value="10Y">10Y</option>
                  </Form.Control>
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDI" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>RED Code</td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealOTCInstrumentShort"
                    name="dealOTCInstrumentShort"
                    disabled
                    value={this.state.dealOTCInstrumentShort}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDI" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>Index Name</td>
                <td style={{ padding: "0.15rem" }}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealIndex"
                    name="dealIndex"
                    disabled
                    value={this.state.dealIndex}
                  />
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDI" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>Fee Rate (%)</td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="number"
                    id="dealFee1"
                    name="dealFee1"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealFee1: Number(e.target.value),
                      })
                    }
                    value={this.state.dealFee1}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Maturity Date:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="date"
                    id="dealMaturityDate"
                    name="dealMaturityDate"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealMaturityDate: e.target.value,
                      })
                    }
                    value={this.state.dealMaturityDate}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Notional Amount:</Form.Label>
                </td>
                <td className="bondInstrumentTd" style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="dealNotionalAmount"
                    name="dealNotionalAmount"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealNotionalAmount: Number(e.target.value),
                      })
                    }
                    value={
                      isNaN(parseFloat(this.state.dealNotionalAmount))
                        ? 0
                        : this.state.dealNotionalAmount
                    }
                  />
                </td>
                <td
                  style={{
                    display:
                      this.props.otcIntrumenetType === "CDS" ? "" : "none",
                    padding: "0.15rem",
                  }}
                >
                  <Form.Label>Currency</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  {this.props.otcIntrumenetType === "CDI" && (
                    <Form.Control
                      type="text"
                      size="sm"
                      id="dealCurrency"
                      name="dealCurrency"
                      placeholder="Currency"
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          dealCurrency: e.target.value,
                        })
                      }
                      value={this.state.dealCurrency}
                    ></Form.Control>
                  )}
                  {this.props.otcIntrumenetType === "CDS" && (
                    <Form.Control
                      custom
                      as="select"
                      size="sm"
                      id="dealCurrency"
                      name="dealCurrency"
                      placeholder="Currency"
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          dealCurrency: e.target.value,
                        })
                      }
                      value={this.state.dealCurrency}
                    >
                      <option value="">Select Currency</option>
                      {this.state.dealIndexesCurrencies.map((currency) => (
                        <option value={currency.isdaCurrency} key={currency.id}>
                          {currency.isdaCurrency}
                        </option>
                      ))}
                    </Form.Control>
                  )}
                </td>
              </tr>
              <tr
                style={{
                  display: this.props.otcIntrumenetType === "CDS" ? "" : "none",
                }}
              >
                <td style={{ padding: "0.15rem" }}>Fee Rate(bps)</td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="select"
                    size="sm"
                    custom
                    name="dealFeeRate"
                    id="dealFeeRate"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealFeeRate: e.target.value,
                      })
                    }
                  >
                    <option id="" disabled selected>
                      Select fee rate
                    </option>
                    {this.state.dealIndexesCurrencies.map((currency) => (
                      <option value={currency.isdaFeeRateBp} key={currency.id}>
                        {currency.isdaFeeRateBp}
                      </option>
                    ))}
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>Quote Type</td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    size="sm"
                    type="number"
                    id="dealQuoteType"
                    name="dealQuoteType"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealQuoteType: Number(e.target.value),
                      })
                    }
                    value={this.state.dealQuoteType}
                  />
                </td>

                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    as="select"
                    style={{ minWidth: "fit-content" }}
                    size="sm"
                    custom
                    name="dealSpreadBps"
                    id="dealSpreadBps"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealSpreadBps: e.target.value,
                      })
                    }
                  >
                    <option id="option1" value="Buy">
                      Spread BPS
                    </option>
                    <option id="option2" value="Sell">
                      Price %
                    </option>
                  </Form.Control>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.15rem" }}>Cleared</td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control
                    style={{
                      minWidth: "-webkit-fill-available",
                      height: "15px",
                      width: "60%",
                    }}
                    size="sm"
                    type="checkbox"
                    id="dealCleared"
                    name="dealCleared"
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        dealCleared: e.target.value,
                      })
                    }
                    value={this.state.dealCleared}
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
