import React from "react";
import { Form } from "react-bootstrap";
export default class QuickKey extends React.Component<{
  fieldName: string;
  parent: any;
}> {
  thousandChangeHandler = () => {
    if (this.props.fieldName === "dealSpotRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSpotRate: this.props.parent.state.dealSpotRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealTics") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealTics: this.props.parent.state.dealTics * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealForwardRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealForwardRate: this.props.parent.state.dealForwardRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealBaseAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealBaseAmount: this.props.parent.state.dealBaseAmount * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuoteAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuoteAmount: this.props.parent.state.dealQuoteAmount * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealBaseCurrencyAmountSpot") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealBaseCurrencyAmountSpot:
          this.props.parent.state.dealBaseCurrencyAmountSpot * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPriceCurrencyAmountSpot") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPriceCurrencyAmountSpot:
          this.props.parent.state.dealPriceCurrencyAmountSpot * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPriceCurrencyAmountForward") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPriceCurrencyAmountForward:
          this.props.parent.state.dealPriceCurrencyAmountForward * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealSettlementAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSettlementAmount:
          this.props.parent.state.dealSettlementAmount * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuantity") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuantity: this.props.parent.state.dealQuantity * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCouponRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        couponRate: this.props.parent.state.couponRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNominal") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNominal: this.props.parent.state.dealNominal * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFaceValue") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFaceValue: this.props.parent.state.dealFaceValue * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPoolFactor") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPoolFactor: this.props.parent.state.dealPoolFactor * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealContractSize") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealContractSize: this.props.parent.state.dealContractSize * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuoteFactor") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuoteFactor: this.props.parent.state.dealQuoteFactor * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealRate: this.props.parent.state.dealRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPrice") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPrice: this.props.parent.state.dealPrice * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealAccruedInterest") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealAccruedInterest: this.props.parent.state.dealAccruedInterest * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCommission") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCommission: this.props.parent.state.dealCommission * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealTax") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealTax: this.props.parent.state.dealTax * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPaymentAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPaymentAmount: this.props.parent.state.dealPaymentAmount * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealSettlementAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSettlementAmount:
          this.props.parent.state.dealSettlementAmount * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealIntrestRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealIntrestRate: this.props.parent.state.dealIntrestRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee1: this.props.parent.state.dealFee1 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee2: this.props.parent.state.dealFee2 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee3") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee3: this.props.parent.state.dealFee3 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealLots") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealLots: this.props.parent.state.dealLots * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "arrivalPrice") {
      this.props.parent.setState({
        ...this.props.parent.state,
        arrivalPrice: this.props.parent.state.arrivalPrice * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealLots") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealLots: this.props.parent.state.dealLots * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "trs_NoOfUnderlyingUnits") {
      this.props.parent.setState({
        ...this.props.parent.state,
        trs_NoOfUnderlyingUnits:
          this.props.parent.state.trs_NoOfUnderlyingUnits * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCurrencyRatelegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCurrencyRatelegno1:
          this.props.parent.state.dealCurrencyRatelegno1 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCurrencyRatelegno2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCurrencyRatelegno2:
          this.props.parent.state.dealCurrencyRatelegno2 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNumberOfUnderlyingUnitslegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNumberOfUnderlyingUnitslegno1:
          this.props.parent.state.dealNumberOfUnderlyingUnitslegno1 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNumberOfUnderlyingUnitslegno2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNumberOfUnderlyingUnitslegno2:
          this.props.parent.state.dealNumberOfUnderlyingUnitslegno2 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealUnderlyingPricelegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealUnderlyingPricelegno1:
          this.props.parent.state.dealUnderlyingPricelegno1 * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "notional") {
      this.props.parent.setState({
        ...this.props.parent.state,
        notional: this.props.parent.state.notional * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "initialRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        initialRate: this.props.parent.state.initialRate * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "spread") {
      this.props.parent.setState({
        ...this.props.parent.state,
        spread: this.props.parent.state.spread * 1000,
        showResults: false,
      });
    } else if (this.props.fieldName === "upFronfFee") {
      this.props.parent.setState({
        ...this.props.parent.state,
        upFronfFee: this.props.parent.state.upFronfFee * 1000,
        showResults: false,
      });
    }
  };
  millionChangeHandler = () => {
    if (this.props.fieldName === "dealSpotRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSpotRate: this.props.parent.state.dealSpotRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealTics") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealTics: this.props.parent.state.dealTics * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealForwardRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealForwardRate: this.props.parent.state.dealForwardRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealBaseAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealBaseAmount: this.props.parent.state.dealBaseAmount * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuoteAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuoteAmount: this.props.parent.state.dealQuoteAmount * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealBaseCurrencyAmountSpot") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealBaseCurrencyAmountSpot:
          this.props.parent.state.dealBaseCurrencyAmountSpot * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPriceCurrencyAmountSpot") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPriceCurrencyAmountSpot:
          this.props.parent.state.dealPriceCurrencyAmountSpot * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPriceCurrencyAmountForward") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPriceCurrencyAmountForward:
          this.props.parent.state.dealPriceCurrencyAmountForward * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealSettlementAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSettlementAmount:
          this.props.parent.state.dealSettlementAmount * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuantity") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuantity: this.props.parent.state.dealQuantity * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCouponRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        couponRate: this.props.parent.state.couponRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNominal") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNominal: this.props.parent.state.dealNominal * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFaceValue") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFaceValue: this.props.parent.state.dealFaceValue * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPoolFactor") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPoolFactor: this.props.parent.state.dealPoolFactor * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealContractSize") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealContractSize: this.props.parent.state.dealContractSize * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealQuoteFactor") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealQuoteFactor: this.props.parent.state.dealQuoteFactor * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealRate: this.props.parent.state.dealRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPrice") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPrice: this.props.parent.state.dealPrice * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealAccruedInterest") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealAccruedInterest:
          this.props.parent.state.dealAccruedInterest * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCommission") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCommission: this.props.parent.state.dealCommission * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealTax") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealTax: this.props.parent.state.dealTax * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealPaymentAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealPaymentAmount: this.props.parent.state.dealPaymentAmount * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealSettlementAmount") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealSettlementAmount:
          this.props.parent.state.dealSettlementAmount * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealIntrestRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealIntrestRate: this.props.parent.state.dealIntrestRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee1: this.props.parent.state.dealFee1 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee2: this.props.parent.state.dealFee2 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealFee3") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealFee3: this.props.parent.state.dealFee3 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealLots") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealLots: this.props.parent.state.dealLots * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "arrivalPrice") {
      this.props.parent.setState({
        ...this.props.parent.state,
        arrivalPrice: this.props.parent.state.arrivalPrice * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealLots") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealLots: this.props.parent.state.dealLots * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "trs_NoOfUnderlyingUnits") {
      this.props.parent.setState({
        ...this.props.parent.state,
        trs_NoOfUnderlyingUnits:
          this.props.parent.state.trs_NoOfUnderlyingUnits * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCurrencyRatelegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCurrencyRatelegno1:
          this.props.parent.state.dealCurrencyRatelegno1 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealCurrencyRatelegno2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealCurrencyRatelegno2:
          this.props.parent.state.dealCurrencyRatelegno2 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNumberOfUnderlyingUnitslegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNumberOfUnderlyingUnitslegno1:
          this.props.parent.state.dealNumberOfUnderlyingUnitslegno1 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealNumberOfUnderlyingUnitslegno2") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealNumberOfUnderlyingUnitslegno2:
          this.props.parent.state.dealNumberOfUnderlyingUnitslegno2 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "dealUnderlyingPricelegno1") {
      this.props.parent.setState({
        ...this.props.parent.state,
        dealUnderlyingPricelegno1:
          this.props.parent.state.dealUnderlyingPricelegno1 * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "notional") {
      this.props.parent.setState({
        ...this.props.parent.state,
        notional: this.props.parent.state.notional * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "initialRate") {
      this.props.parent.setState({
        ...this.props.parent.state,
        initialRate: this.props.parent.state.initialRate * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "spread") {
      this.props.parent.setState({
        ...this.props.parent.state,
        spread: this.props.parent.state.spread * 1000000,
        showResults: false,
      });
    } else if (this.props.fieldName === "upFronfFee") {
      this.props.parent.setState({
        ...this.props.parent.state,
        upFronfFee: this.props.parent.state.upFronfFee * 1000000,
        showResults: false,
      });
    }
  };

  render() {
    return (
      <Form.Text id="passwordHelpBlock" muted>
        <span onClick={this.thousandChangeHandler}>{"K"}</span>
        <span>&emsp;</span>
        <span onClick={this.millionChangeHandler}>{"M"}</span>
      </Form.Text>
    );
  }
}
