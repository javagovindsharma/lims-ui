import React from "react";
import { Form, Table } from "react-bootstrap";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import { bondTransactionNumericDataFields } from "../../../helpers/constants";
import {
   FXTransactionNumericFields,
   FXTypes,
   FXTypesValues,
} from "../../../helpers/constants";
import { Currency } from "../../../types/Transaction";
import { getCurrencyCrosses } from "../Deal/DealService";
import QuickKey from "./QuickKey";
import Results from "./QuickKey";

export default class DealInformationPage extends React.Component<{
   txnType: string;
   otcIntrumenetType: string;
   transactionCode: string;
   type: any;
   parent: any;
}> {
   resultRef: React.RefObject<Results> = React.createRef();
   public file!: File;
   state = {
      //deal information fields
      dealCouponRate: "",
      dealNominal: "",
      dealFaceValue: "",
      dealPoolFactor: "",
      dealQuoteFactor: "",
      dealPrice: "",
      dealYield: "",
      dealAccruedInterest: "",
      dealCleanValue: "",
      dealCurrency: "",
      dealSettlementCurrency: "",
      dealPriceCurrency: "",
      dealquoteCurrency: "",
      dealTradeDate: "",
      dealValueDate: "",
      dealMaturityDate: "",
      dealQuantity: "",
      dealFee1: "",
      dealFee2: "",
      dealFee3: "",
      dealCommission: "",
      dealOtherFee: "",
      dealTax: "",
      dealPaymentAmount: "",
      dealSettlementAmount: "",
      dealTransactionCode: "",
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
      dealIntrestRate: "",
      dealRate: "",

      errors: {
         dealQuoteFactor: "",
         dealPrice: "",
      },
      bondTypeABSorMBS: true,
      poolFactorValues: [0, 1],
      showFlag: "",
      currencyCrosses: [],
      isFXSwap: false,
      showQuickFlag: "",
   };
   initialState: any;

   componentDidMount() {
      this.initialState = this.state;
      if (this.props.txnType === "FX") {
         getCurrencyCrosses().then((res: any) => {
            const currencyResponse = res ? res : [];
            this.setState({ currencyCrosses: currencyResponse });
         });
      }
   }
   onClick = () => this.setState({ showResults: true });
   resetDealInfo() {
      this.setState(this.initialState);
   }
   constructor(props: any) {
      super(props);
      this.changeCurrencyPair = this.changeCurrencyPair.bind(this);
   }

   allowNumbersOnly = (event: { target: { name: any; value: any } }) => {
      let positiveArray = [""];
      this.setState({ showQuickFlag: event.target.name });
      let re: RegExp;
      if (positiveArray.indexOf(event.target.name) > -1) {
         re = new RegExp("^[0-9\b]+$");
      } else {
         re = new RegExp("^[-+]?[0-9]{0,900}(?:\\.[0-9]{0,900})?$");
      }
      if (event.target.value === "" || re.test(event.target.value)) {
         this.setState({ [event.target.name]: event.target.value });
      }
   };
   numericChangeHandler = (event: { target: { name: any; value: any } }) => {
      this.setState({ showResults: true });
      if (this.props.txnType === "BOND") {
         this.bondNumricChange(event);
      }
      if (this.props.txnType === "CFD") {
         this.CfdNumericChangeHandler(event);
      }
      if (this.props.txnType === "EQUITY") {
         this.equityNumericChangeHandler(event);
      }
      if (this.props.txnType === "FUTURE") {
         this.futureNumericChangeHandler(event);
      }
      if (this.props.txnType === "FX") {
         this.fxNumericChangeHandler(event);
      }
      if (this.props.txnType === "OPTION") {
         this.optionNumericChangeHandler(event);
      }
      if (this.props.txnType === "DEPOSIT") {
         this.setState({ dealTransactionCode: "Buy" });
         this.depositNumericChangeHandler(event);
      }
      if (this.props.txnType === "REPOS") {
         this.reposNumericChangeHandler(event);
      }
   };
   bondNumricChange = (event: { target: { name: any; value: any } }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      let errors = this.state.errors;
      let numericFields = [
         "dealCouponRate",
         "dealNominal",
         "dealFaceValue",
         "dealPoolFactor",
         "dealQuoteFactor",
         "dealPrice",
         "dealYield",
         "dealAccruedInterest",
         "dealCleanValue",
         "dealCommission",
         "dealOtherFee",
         "dealTax",
         "dealPaymentAmount",
         "dealSettlementAmount",
         "dealFee1",
         "dealFee2",
         "dealFee3",
      ];
      let actualNumericFieldNames = [
         "Coupon Rate",
         "Nominal",
         "Face Value",
         "Pool Factor",
         "Quote Factor",
         "Price",
         "Yield",
         "Accured Interest",
         "Clean Value",
         "Commission",
         "Other Fee",
         "Fee1",
         "Fee2",
         "Fee3",
         "Tax",
         "Payment Amount",
         "Settlement Amount",
      ];
      //numeric validations, thrown when field is not of numeric type
      // numericFields = [];
      let currentField = numericFields.indexOf(nam);
      if (val === "-") {
      } else if (currentField > -1 && Number(val) !== 0 && !Number(val)) {
         errorMsgs.push(
            actualNumericFieldNames[currentField] + " must be Numeric"
         );
         this.props.type(errorMsgs);
         val = "";
      }

      if (nam === "dealCouponRate") {
         this.props.parent.setState({
            couponRate: val === "-" ? "-" : val === "" ? "" : Number(val),
         });
         this.props.parent.instrumentRef?.current.setState({
            instrumentCouponRate: Number(val),
         });
      }
      //setting pool factor value to text box
      if (nam === "poolFactor") {
         this.setState({ dealPoolFactor: val });
      }

      // in field validation only for 2 fields qouteFactor and price (nagative values)

      /*  if (nam === bondTransactionNumericDataFields.dealQuoteFactor && val < 0) {
      errors.dealQuoteFactor = "Quote Factor can not be in Negative";
    } else if (nam === bondTransactionNumericDataFields.dealPrice && val < 0) {
      errors.dealPrice = "Price can not be Negative";
    } else {
      errors.dealQuoteFactor = "";
      errors.dealPrice = "";
    }*/
      this.setState({ [nam]: val });
      let fieldIndex = 0;

      // let txnCode =
      //   nam === bondTransactionNumericDataFields.dealTransactionCode
      //     ? val === "1"
      //       ? true
      //       : false
      //     : this.state.dealTransactionCode === "1"
      //     ? true
      //     : false;

      let dealNominal =
         nam === bondTransactionNumericDataFields.dealNominal
            ? val
            : Number(this.state.dealNominal);
      let dealFaceValue =
         nam === bondTransactionNumericDataFields.dealFaceValue
            ? val
            : Number(this.state.dealFaceValue);
      let dealPoolFactor =
         nam === bondTransactionNumericDataFields.dealPoolFactor
            ? val
            : Number(this.state.dealPoolFactor);
      let dealQuoteFactor =
         nam === bondTransactionNumericDataFields.dealQuoteFactor
            ? val
            : Number(this.state.dealQuoteFactor);
      let dealPrice =
         nam === bondTransactionNumericDataFields.dealPrice
            ? val
            : Number(this.state.dealPrice);
      // let dealYield =
      //   nam === bondTransactionNumericDataFields.dealYield
      //     ? val
      //     : Number(this.state.dealYield);
      let dealAccruedInterest =
         nam === bondTransactionNumericDataFields.dealAccruedInterest
            ? val
            : Number(this.state.dealAccruedInterest);
      let dealCleanValue =
         nam === bondTransactionNumericDataFields.dealCleanValue
            ? val
            : Number(this.state.dealCleanValue);
      // let dealSettlementCurrency =
      //   nam === bondTransactionNumericDataFields.dealSettlementCurrency
      //     ? val
      //     : Number(this.state.dealSettlementCurrency);

      // let dealCommission: number =
      //   nam === numericFields[fieldIndex++]
      //      ? val
      //     : Number(this.state.dealCommission);
      // let dealOtherFee: number =
      //   nam === numericFields[fieldIndex++]
      //     ? val
      //     : Number(this.state.dealOtherFee);
      // let dealTax: number =
      //   nam === numericFields[fieldIndex++] ? val : Number(this.state.dealTax);
      //  let fees: number =
      //   Number(dealCommission) + Number(dealOtherFee) + Number(dealTax);

      //calculations below

      let fee1: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee1);
      let fee2: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee2);
      let fee3: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee3);
      let fees: number = Number(fee1) + Number(fee2) + Number(fee3);
      dealNominal = this.state.bondTypeABSorMBS
         ? Number(dealFaceValue) * Number(dealPoolFactor)
         : Number(dealNominal);
      let dealPaymentAmount =
         Number(dealCleanValue) + Number(dealAccruedInterest) + Number(fees);

      //if yield is selected then payment amount should be 0
      if (nam === "dealPriceOrYield" && val === "yield") {
         dealPaymentAmount = 0;
         dealCleanValue = 0;
      } else {
         dealCleanValue = Number(
            (Number(dealNominal) * Number(dealPrice)) / Number(dealQuoteFactor)
         );
         dealCleanValue = isNaN(dealCleanValue) ? 0 : Number(dealCleanValue);
      }

      if (isNaN(dealPaymentAmount)) {
         dealPaymentAmount =
            dealCleanValue > 0 && dealNominal > 0
               ? Number(dealPaymentAmount)
               : 0;
      }
      this.setState({
         dealPaymentAmount: dealPaymentAmount,
         dealCleanValue: dealCleanValue,
         dealNominal: dealNominal,
      });
   };

   CfdNumericChangeHandler = (event: { target: { name: any; value: any } }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      this.setState({
         errors: {},
      });
      let numericFields = [
         /* "dealQuantity",
      "dealQuoteFactor",
      "dealPrice",
      "dealFee1",
      "dealFee2",
      "dealFee3",*/
         "deal",
      ];
      let actualNumericFieldNames = [
         "",
         /* "Quantity",
      "Qoute Factor",
      "Price",
      "Fee1",
      "Fee2",
      "Fee3",*/
      ];
      let currentField = numericFields.indexOf(nam);
      if (currentField > -1 && Number(val) !== 0 && !Number(val)) {
         errorMsgs.push(
            actualNumericFieldNames[currentField] + " must be Numeric"
         );
         this.props.type(errorMsgs);
         val = "";
      }

      this.setState({ [nam]: val });
      let fieldIndex = 0;
      let qty =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealQuantity);
      let qouteFactor =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealQuoteFactor);
      let price =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealPrice);
      let fee1: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee1);
      let fee2: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee2);
      let fee3: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee3);
      let fees: number = Number(fee1) + Number(fee2) + Number(fee3);
      let txnCode =
         nam === "dealTransactionCode"
            ? val === "Buy"
               ? true
               : false
            : this.state.dealTransactionCode === "Buy"
            ? true
            : false;
      let fixedAmt = qty * (price / (qouteFactor === 0 ? 1 : qouteFactor));
      let totalPayment = txnCode ? fixedAmt + fees : fixedAmt - fees;
      //alert(totalPayment);

      this.setState({ dealPaymentAmount: totalPayment + "" });
   };

   equityNumericChangeHandler = (event: {
      target: { name: any; value: any };
   }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      let numericFields = [
         "dealQuantity",
         "dealQuoteFactor",
         "dealPrice",
         "dealFee1",
         "dealFee2",
         "dealFee3",
         "dealPaymentAmount",
         "dealSettlementAmount",
      ];
      let actualNumericFieldNames = [
         "Quantity",
         "Qoute Factor",
         "Price",
         "Fee1",
         "Fee2",
         "Fee3",
         "Payment Amount",
         "Settlement Amount",
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
      let fieldIndex = 0;
      let qty =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealQuantity);
      let qouteFactor =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealQuoteFactor);
      let price =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealPrice);
      let fee1: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee1);
      let fee2: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee2);
      let fee3: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee3);
      let fees: number = Number(fee1) + Number(fee2) + Number(fee3);
      let txnCode =
         nam === "dealTransactionCode"
            ? val === "Buy"
               ? true
               : false
            : this.state.dealTransactionCode === "Buy"
            ? true
            : false;
      if (nam === "dealSettlementCurrency") {
         this.props.parent.setState({ settlementCurrency: val });
         this.props.parent.instrumentRef?.current.setState({
            instrumentSettlementCurrency: val,
         });
      }
      let fixedAmt = qty * (price / (qouteFactor === 0 ? 1 : qouteFactor));
      let totalPayment = txnCode ? fixedAmt + fees : fixedAmt - fees;
      //alert(totalPayment);
      this.setState({ dealPaymentAmount: totalPayment + "" });
   };

   futureNumericChangeHandler = (event: {
      target: { name: any; value: any };
   }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      this.setState({
         errors: {},
      });

      let numericFields = [
         "dealQuantity",
         "dealQuoteFactor",
         "dealPrice",
         "dealFee1",
         "dealFee2",
         "dealFee3",
         "dealContractSize",
      ];
      let actualNumericFieldNames = [
         "No of Contract",
         "Qoute Factor",
         "Price",
         "Fee 1",
         "Fee 2",
         "Fee 3",
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
      // let fieldIndex = 0;
      // let qty =
      //   nam === numericFields[fieldIndex++]
      //     ? val
      //     : Number(this.state.dealQuantity);
      // let qouteFactor =
      //   nam === numericFields[fieldIndex++]
      //     ? val
      //     : Number(this.state.dealQuoteFactor);
      // let price =
      //   nam === numericFields[fieldIndex++] ? val : Number(this.state.dealPrice);
      // let fee1: number =
      //   nam === numericFields[fieldIndex++] ? val : Number(this.state.dealFee1);
      // let fee2: number =
      //   nam === numericFields[fieldIndex++] ? val : Number(this.state.dealFee2);
      // let fee3: number =
      //   nam === numericFields[fieldIndex++] ? val : Number(this.state.dealFee3);
      // let fees: number = Number(fee1) + Number(fee2) + Number(fee3);
      // let txnCode =
      //   nam === "dealTransactionCode"
      //     ? val === "Buy"
      //       ? true
      //       : false
      //     : this.state.dealTransactionCode === "Buy"
      //     ? true
      //     : false;
      // let fixedAmt = qty * (price / (qouteFactor === 0 ? 1 : qouteFactor));
      // let totalPayment = txnCode ? fixedAmt + fees : fixedAmt - fees;
      //alert(totalPayment);
   };

   fxNumericChangeHandler = (event: { target: { name: any; value: any } }) => {
      let nam = event.target?.name;
      let val = event.target?.value;
      let errorMsgs = [];
      let numericFields = [
         "dealCurrency",
         "dealPriceCurrency",
         "dealQuoteAmount",
         "dealSettlementAmount",
         "dealSpotRate",
         "dealTics",
         "dealForwardRate",
         "dealBaseAmount",
         "dealBaseCurrencyAmountSpot",
         "dealBaseCurrencyAmountForward",
         "dealPriceCurrencyAmountSpot",
         "dealPriceCurrencyAmountForward",
      ];
      let actualNumericFieldNames = [
         "dealCurrency",
         "dealPriceCurrency",
         "dealQuoteAmount",
         "dealSettlementAmount",
         "dealSpotRate",
         "dealTics",
         "dealForwardRate",
         "dealBaseAmount",
         "dealBaseCurrencyAmountSpot",
         "dealBaseCurrencyAmountForward",
         "dealPriceCurrencyAmountSpot",
         "dealPriceCurrencyAmountForward",
      ];
      //numericFields = []; //done to avoid calculation as formula not provided for FX
      let currentField = numericFields.indexOf(nam);

      if (currentField > -1 && Number(val) !== 0 && !Number(val)) {
         errorMsgs.push(
            actualNumericFieldNames[currentField] + " must be Numeric"
         );
         this.setState({ showAlert: true, alertMessage: errorMsgs });
         val = "";
      }

      if (nam !== "dealFXType") {
         this.setState({ [nam]: val });
      }

      if (nam === "dealCurrencyPair") {
      }

      let dealPriceCurrencyAmountSpot = 0;
      let dealPriceCurrencyAmountForward = 0;
      let dealSpotRate =
         nam === FXTransactionNumericFields.dealSpotRate
            ? Number(val)
            : Number(this.state.dealSpotRate);
      let dealTics =
         nam === FXTransactionNumericFields.dealTics
            ? Number(val)
            : Number(this.state.dealTics);
      let dealForwardRate: number = Number(dealSpotRate) + Number(dealTics); //add to state

      let dealBaseAmount: number =
         nam === FXTransactionNumericFields.dealBaseAmount
            ? Number(val)
            : Number(this.state.dealBaseAmount);
      let dealQuoteAmount: number = 0;

      if (
         (nam === "dealFXType" && val === FXTypesValues.Forward) ||
         this.state.dealFXType === FXTypesValues.Forward
      ) {
         for (let i = 0; i < this.state.currencyCrosses.length; i++) {
            if (
               Number(this.state.currencyCrosses[i]["id"]) ===
               Number(this.state.dealCurrencyPair)
            ) {
               if (this.state.currencyCrosses[i]["inverted"]) {
                  dealQuoteAmount = dealBaseAmount / dealForwardRate;
               } else {
                  dealQuoteAmount = dealForwardRate * dealBaseAmount;
               }
            }
         }
      } else if (
         (nam === "dealFXType" && val === "Spot") ||
         this.state.dealFXType === "Spot"
      ) {
         //add to state
         for (let i = 0; i < this.state.currencyCrosses.length; i++) {
            if (
               Number(this.state.currencyCrosses[i]["id"]) ===
               Number(this.state.dealCurrencyPair)
            ) {
               if (this.state.currencyCrosses[i]["inverted"]) {
                  dealQuoteAmount = dealBaseAmount / dealSpotRate;
               } else {
                  dealQuoteAmount = dealBaseAmount * dealSpotRate;
               }
            }
         }
      } else {
         dealQuoteAmount = dealForwardRate * dealBaseAmount;
      }
      if (this.state.dealFXType === FXTypesValues.FXSwap) {
         let dealBaseCurrencyAmountSpot: number =
            nam === FXTransactionNumericFields.dealBaseCurrencyAmountSpot
               ? val
               : Number(this.state.dealBaseCurrencyAmountSpot);
         dealPriceCurrencyAmountSpot =
            dealBaseCurrencyAmountSpot * dealSpotRate; //add to state
         let dealBaseCurrencyAmountForward: number =
            nam === FXTransactionNumericFields.dealBaseCurrencyAmountForward
               ? val
               : this.state.dealBaseCurrencyAmountForward;
         dealPriceCurrencyAmountForward =
            dealBaseCurrencyAmountForward * dealForwardRate; //add to state
      }

      this.setState({
         dealForwardRate: dealForwardRate,
         dealQuoteAmount: dealQuoteAmount,
         dealPriceCurrencyAmountSpot: dealPriceCurrencyAmountSpot,
         dealPriceCurrencyAmountForward: dealPriceCurrencyAmountForward,
      });
   };
   changeCurrencyPair = () => {
      for (let i = 0; i < this.state.currencyCrosses.length; i++) {
         if (
            parseInt(this.state.dealCurrencyPair) ===
            this.state.currencyCrosses[i]["id"]
         ) {
            this.setState({
               dealquoteCurrency:
                  this.state.currencyCrosses[i]["quoteCurrency"],
               dealBaseCurrency: this.state.currencyCrosses[i]["baseCurrency"],
            });
         }
      }
   };

   optionNumericChangeHandler = (event: {
      target: { name: any; value: any };
   }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      let numericFields = [
         "dealQuantity",
         "dealLots",
         "dealPrice",
         "dealFee1",
         "dealFee2",
         "dealFee3",
      ];
      let actualNumericFieldNames = [
         "Quantity",
         "Qoute Factor",
         "Price",
         "Fee 1",
         "Fee 2",
         "Fee 3",
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

      let fieldIndex = 0;
      let qty =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealQuantity);
      let qouteFactor =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealLots);
      let price =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealPrice);
      let fee1: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee1);
      let fee2: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee2);
      let fee3: number =
         nam === numericFields[fieldIndex++]
            ? val
            : Number(this.state.dealFee3);
      let fees: number = Number(fee1) + Number(fee2) + Number(fee3);
      let txnCode =
         nam === "dealTransactionCode"
            ? val === "Buy"
               ? true
               : false
            : this.state.dealTransactionCode === "BUy"
            ? true
            : false;
      let fixedAmt = qty * (price / (qouteFactor === 0 ? 1 : qouteFactor));
      let totalPayment = txnCode ? fixedAmt + fees : fixedAmt - fees;
      //alert(totalPayment);
      this.setState({ dealPaymentAmount: totalPayment + "" });
   };
   depositNumericChangeHandler = (event: {
      target: { name: any; value: any };
   }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      let numericFields = ["dealPrice", "dealIntrestRate", "dealPaymentAmount"];
      let actualNumericFieldNames = [
         "Price",
         "Interest Rate",
         "Payment Amount",
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
   reposNumericChangeHandler = (event: {
      target: { name: any; value: any };
   }) => {
      let nam = event.target.name;
      let val = event.target.value;
      let errorMsgs = [];
      let numericFields = ["dealPrice", "dealNominal", "dealRate"];
      let actualNumericFieldNames = ["Price", "nominal", "Rate"];
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
         <fieldset className="scheduler-border">
            <legend className="scheduler-border">Deal Information</legend>
            <div>
               <Table
                  className="dealInfoTable"
                  borderless={true}
                  style={{
                     tableLayout: "auto",
                     width:
                        this.props.txnType !== "BOND" &&
                        this.props.txnType !== "FX"
                           ? "47%"
                           : "",
                  }}
               >
                  <tbody>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION" ||
                              this.props.txnType === "CFD"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Transaction Code:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              style={{
                                 width: "90%",
                              }}
                              name="dealTransactionCode"
                              id="dealTransactionCode"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealTransactionCode}
                              custom
                              size="sm"
                           >
                              <option value="" disabled>
                                 Select an Transaction Code
                              </option>
                              <option value="Buy" key="Buy">
                                 Buy
                              </option>
                              <option value="Sell" key="Sell">
                                 Sell
                              </option>
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "REPOS" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Transaction Code:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              style={{
                                 width: "90%",
                              }}
                              custom
                              size="sm"
                              name="dealTransactionCode"
                              id="dealTransactionCode"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealTransactionCode}
                           >
                              <option value="" disabled selected>
                                 Select an Transaction Code
                              </option>
                              <option value="BuySellBack">BuySellBack</option>
                              <option value="SellBuyBack">SellBuyBack</option>
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "OPTION" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Open/Close:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              style={{
                                 width: "90%",
                              }}
                              name="dealOpenClose"
                              id="dealOpenClose"
                              onChange={this.numericChangeHandler}
                              custom
                              size="sm"
                           >
                              <option value="0" id="option0" disabled selected>
                                 Select Open/Close
                              </option>
                              <option value="1" id="open">
                                 Open
                              </option>
                              <option value="2" id="close">
                                 Close
                              </option>
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "OPTION" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Lots:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealLots"
                              name="dealLots"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealLots}
                           />
                           {this.state.showQuickFlag === "dealLots" ? (
                              <QuickKey
                                 fieldName="dealLots"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>CLS:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              style={{
                                 width: "90%",
                              }}
                              name="dealCLS"
                              id="dealCLS"
                              onChange={this.numericChangeHandler}
                              custom
                              size="sm"
                           >
                              <option value="0" id="option0" disabled selected>
                                 Select CLS
                              </option>
                              <option value="1" id="option1">
                                 Yes
                              </option>
                              <option value="2" id="option2">
                                 No
                              </option>
                           </Form.Control>
                        </td>
                        <td
                           style={{
                              width: "20%",
                           }}
                        ></td>
                        <td
                           style={{
                              width: "20%",
                           }}
                        ></td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Currency Pair:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              custom
                              size="sm"
                              style={{
                                 width: "90%",
                              }}
                              className="portfolio"
                              name="dealCurrencyPair"
                              onChange={(event) =>
                                 this.setState(
                                    { dealCurrencyPair: event.target.value },
                                    () => {
                                       this.changeCurrencyPair();
                                       this.numericChangeHandler(event);
                                    }
                                 )
                              }
                           >
                              <option value="0" disabled selected>
                                 Select Currency
                              </option>
                              {this.state.currencyCrosses
                                 .sort((a: any, b: any) =>
                                    a.currencyPair.localeCompare(b.currencyPair)
                                 )
                                 .map((key: Currency, index: number) => {
                                    return (
                                       <option key={index} value={key.id}>
                                          {key.currencyPair}
                                       </option>
                                    );
                                 })}
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>FX Type:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              as="select"
                              style={{
                                 width: "90%",
                              }}
                              custom
                              size="sm"
                              name="dealFXType"
                              id="dealFXType"
                              onChange={(event: any) => {
                                 this.setState(
                                    { dealFXType: event.target.value },
                                    () => this.numericChangeHandler(event)
                                 );
                              }}
                           >
                              <option value="" id="option0" disabled selected>
                                 Select FX Type
                              </option>
                              {FXTypes.map((key, index) => {
                                 return (
                                    <option value={key} key={index}>
                                       {key}
                                    </option>
                                 );
                              })}
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Spot Rate:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealSpotRate"
                              name="dealSpotRate"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealSpotRate}
                           />{" "}
                           {this.state.showQuickFlag === "dealSpotRate" ? (
                              <QuickKey
                                 fieldName="dealSpotRate"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Tics:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealTics"
                              name="dealTics"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealTics}
                           />{" "}
                           {this.state.showQuickFlag === "dealTics" ? (
                              <QuickKey
                                 fieldName="dealTics"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Forward Rate:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealForwardRate"
                              name="dealForwardRate"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealForwardRate}
                           />{" "}
                           {this.state.showQuickFlag === "dealForwardRate" ? (
                              <QuickKey
                                 fieldName="dealForwardRate"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     {this.state.dealFXType !== FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Base Amount:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealBaseAmount"
                                 name="dealBaseAmount"
                                 onChange={this.numericChangeHandler}
                                 value={this.state.dealBaseAmount}
                              />{" "}
                              {this.state.showQuickFlag === "dealBaseAmount" ? (
                                 <QuickKey
                                    fieldName="dealBaseAmount"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                        </tr>
                     )}
                     {this.state.dealFXType !== FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Base Currency:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealBaseCurrency"
                                 name="dealBaseCurrency"
                                 onChange={this.numericChangeHandler}
                                 value={this.state.dealBaseCurrency}
                              />
                           </td>
                        </tr>
                     )}
                     {this.state.dealFXType !== FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Quote Amount:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealQuoteAmount"
                                 name="dealQuoteAmount"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={this.state.dealQuoteAmount}
                              />{" "}
                              {this.state.showQuickFlag ===
                              "dealQuoteAmount" ? (
                                 <QuickKey
                                    fieldName="dealQuoteAmount"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                        </tr>
                     )}
                     {this.state.dealFXType !== FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Quote Currency:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealquoteCurrency"
                                 name="dealquoteCurrency"
                                 onChange={this.numericChangeHandler}
                                 value={this.state.dealquoteCurrency}
                              />
                           </td>
                        </tr>
                     )}

                     {this.state.dealFXType === FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>
                                 Base Currency Amount Spot*
                              </Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 type="text"
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 id="dealBaseCurrencyAmountSpot"
                                 name="dealBaseCurrencyAmountSpot"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={this.state.dealBaseCurrencyAmountSpot}
                              />{" "}
                              {this.state.showQuickFlag ===
                              "dealBaseCurrencyAmountSpot" ? (
                                 <QuickKey
                                    fieldName="dealBaseCurrencyAmountSpot"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>
                                 Forward Currency Base Amount*
                              </Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 type="text"
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 id="dealBaseCurrencyAmountForward"
                                 name="dealBaseCurrencyAmountForward"
                                 onChange={this.numericChangeHandler}
                                 value={
                                    this.state.dealBaseCurrencyAmountForward
                                 }
                              />
                           </td>
                        </tr>
                     )}
                     {this.state.dealFXType === FXTypesValues.FXSwap && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>
                                 Price Currency Amount Spot*
                              </Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 type="text"
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 id="dealPriceCurrencyAmountSpot"
                                 name="dealPriceCurrencyAmountSpot"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={this.state.dealPriceCurrencyAmountSpot}
                              />{" "}
                              {this.state.showQuickFlag ===
                              "dealPriceCurrencyAmountSpot" ? (
                                 <QuickKey
                                    fieldName="dealPriceCurrencyAmountSpot"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>
                                 Forward Currency Price Amount*
                              </Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 type="text"
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 id="dealPriceCurrencyAmountForward"
                                 name="dealPriceCurrencyAmountForward"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={
                                    this.state.dealPriceCurrencyAmountForward
                                 }
                              />{" "}
                              {this.state.showQuickFlag ===
                              "dealPriceCurrencyAmountForward" ? (
                                 <QuickKey
                                    fieldName="dealPriceCurrencyAmountForward"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                        </tr>
                     )}
                     {this.state.dealFXType === FXTypesValues.NDF && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Settlement Amount:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealSettlementAmount"
                                 name="dealSettlementAmount"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={this.state.dealSettlementAmount}
                              />{" "}
                              {this.state.showQuickFlag ===
                              "dealSettlementAmount" ? (
                                 <QuickKey
                                    fieldName="dealSettlementAmount"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                        </tr>
                     )}
                     <tr
                        style={{
                           display: this.props.txnType === "FX" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Maturity Date:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "22px",
                                 minWidth: "90%",
                                 padding: "0",
                              }}
                              type="date"
                              className="form-date-custom"
                              id="dealMaturityDate"
                              name="dealMaturityDate"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealMaturityDate}
                           />
                        </td>
                     </tr>
                     {this.state.dealFXType === FXTypesValues.NDF && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "FX" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Settlement Currency:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 type="text"
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 id="dealSettlementCurrency"
                                 name="dealSettlementCurrency"
                                 onChange={this.numericChangeHandler}
                                 value={
                                    this.props.parent.state.settlementCurrency
                                 }
                              />
                           </td>
                        </tr>
                     )}
                     <tr
                        style={{
                           display:
                              this.props.txnType === "FUTURE" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Number of Contract:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealQuantity"
                              name="dealQuantity"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealQuantity}
                           />{" "}
                           {this.state.showQuickFlag === "dealQuantity" ? (
                              <QuickKey
                                 fieldName="dealQuantity"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Quantity:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealQuantity"
                              name="dealQuantity"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealQuantity}
                           />{" "}
                           {this.state.showQuickFlag === "dealQuantity" ? (
                              <QuickKey
                                 fieldName="dealQuantity"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Price:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealPrice"
                              name="dealPrice"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealPrice}
                           />{" "}
                           {this.state.showQuickFlag === "dealPrice" ? (
                              <QuickKey
                                 fieldName="dealPrice"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "CFD" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Price Currency:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              type="text"
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              id="dealPriceCurrency"
                              name="dealPriceCurrency"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealPriceCurrency}
                              readOnly
                           />
                        </td>
                     </tr>

                     <tr
                        style={{
                           display: this.props.txnType === "BOND" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Coupon rate:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealCouponRate"
                              name="dealCouponRate"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.props.parent.state.couponRate}
                           />
                           {this.state.showQuickFlag === "dealCouponRate" ? (
                              <QuickKey
                                 fieldName="dealCouponRate"
                                 ref={this.resultRef}
                                 parent={this.props.parent}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "REPOS"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Nominal:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealNominal"
                              name="dealNominal"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealNominal}
                           />{" "}
                           {this.state.showQuickFlag === "dealNominal" ? (
                              <QuickKey
                                 fieldName="dealNominal"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     {this.state.bondTypeABSorMBS && (
                        <tr
                           style={{
                              display:
                                 this.props.txnType === "BOND" ? "" : "none",
                           }}
                        >
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Label>Face Value:</Form.Label>
                           </td>
                           <td style={{ padding: "0.15rem" }}>
                              <Form.Control
                                 style={{
                                    height: "15px",
                                    width: "90%",
                                 }}
                                 type="text"
                                 id="dealFaceValue"
                                 name="dealFaceValue"
                                 onChange={(event) => {
                                    this.numericChangeHandler(event);
                                    this.allowNumbersOnly(event);
                                 }}
                                 value={this.state.dealFaceValue}
                              />{" "}
                              {this.state.showQuickFlag === "dealFaceValue" ? (
                                 <QuickKey
                                    fieldName="dealFaceValue"
                                    ref={this.resultRef}
                                    parent={this}
                                 />
                              ) : (
                                 <></>
                              )}
                           </td>
                        </tr>
                     )}
                     {this.state.bondTypeABSorMBS &&
                        this.props.txnType === "BOND" && (
                           <tr>
                              <td style={{ padding: "0.15rem" }}>
                                 <Form.Label>Pool Factor:</Form.Label>
                              </td>
                              <td style={{ padding: "0.15rem" }}>
                                 <Form.Control
                                    style={{
                                       height: "15px",
                                       width: "90%",
                                    }}
                                    type="text"
                                    id="dealPoolFactor"
                                    name="dealPoolFactor"
                                    onChange={(event) => {
                                       this.numericChangeHandler(event);
                                       this.allowNumbersOnly(event);
                                    }}
                                    value={this.state.dealPoolFactor}
                                 />{" "}
                                 {this.state.showQuickFlag ===
                                 "dealPoolFactor" ? (
                                    <QuickKey
                                       fieldName="dealPoolFactor"
                                       ref={this.resultRef}
                                       parent={this}
                                    />
                                 ) : (
                                    <></>
                                 )}
                              </td>
                              <td
                                 style={{
                                    padding: "0.15rem",
                                    width: "385.25px",
                                 }}
                              >
                                 <Form.Control
                                    style={{
                                       width: "90%",
                                    }}
                                    custom
                                    size="sm"
                                    as="select"
                                    name="poolFactor"
                                    id="poolFactor"
                                    onChange={this.numericChangeHandler}
                                 >
                                    <option>Select Pool Factor</option>
                                    {this.state.poolFactorValues.map(
                                       (value: number, index: number) => {
                                          return (
                                             <option key={index} value={value}>
                                                {value}
                                             </option>
                                          );
                                       }
                                    )}
                                 </Form.Control>
                              </td>
                           </tr>
                        )}
                     <tr
                        style={{
                           display:
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Currency:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              type="text"
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              id="dealSettlementCurrency"
                              name="dealSettlementCurrency"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealSettlementCurrency}
                              readOnly
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "FUTURE" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Contract Size:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealContractSize"
                              name="dealContractSize"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealContractSize}
                           />{" "}
                           {this.state.showQuickFlag === "dealContractSize" ? (
                              <QuickKey
                                 fieldName="dealContractSize"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "DEPOSIT"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Currency:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealCurrency"
                              name="dealCurrency"
                              onChange={this.numericChangeHandler}
                              value={
                                 this.props.txnType === "DEPOSIT"
                                    ? this.props.parent.state
                                         .instrumentQoutedCurrency
                                    : this.state.dealCurrency
                              }
                              readOnly
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Settlement Currency:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              type="text"
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              id="dealSettlementCurrency"
                              name="dealSettlementCurrency"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealSettlementCurrency}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Quote Factor:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealQuoteFactor"
                              name="dealQuoteFactor"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealQuoteFactor}
                           />{" "}
                           {this.state.showQuickFlag === "dealQuoteFactor" ? (
                              <QuickKey
                                 fieldName="dealQuoteFactor"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                           {this.state.errors.dealQuoteFactor !== "" && (
                              <td className="error">
                                 {this.state.errors.dealQuoteFactor}
                              </td>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "REPOS"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Price or Yield:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem", width: "385.25px" }}>
                           <Form.Control
                              style={{
                                 width: "90%",
                              }}
                              custom
                              size="sm"
                              as="select"
                              name="dealPriceOrYield"
                              id="dealPriceOrYield"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealPriceOrYield}
                           >
                              <option value="" disabled selected>
                                 Select Option
                              </option>
                              <option value="Price">Price</option>
                              <option value="Yield">Yield</option>
                           </Form.Control>
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "REPOS" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Rate :</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealRate"
                              name="dealRate"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealRate}
                           />{" "}
                           {this.state.showQuickFlag === "dealRate" ? (
                              <QuickKey
                                 fieldName="dealRate"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "BOND" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Price/Yield Value:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              as="input"
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealPrice"
                              name="dealPrice"
                              onChange={(event) => {
                                 console.log("das");
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealPrice}
                           />{" "}
                           {this.state.errors.dealPrice !== "" && (
                              <td className="error">
                                 {this.state.errors.dealPrice}
                              </td>
                           )}
                           {this.state.showQuickFlag === "dealPrice" ? (
                              <QuickKey
                                 fieldName="dealPrice"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "BOND" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Accrued Interest:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealAccruedInterest"
                              name="dealAccruedInterest"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealAccruedInterest}
                           />
                           {this.state.showQuickFlag ===
                           "dealAccruedInterest" ? (
                              <QuickKey
                                 fieldName="dealAccruedInterest"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display: this.props.txnType === "BOND" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Clean Value:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="number"
                              id="dealCleanValue"
                              name="dealCleanValue"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealCleanValue}
                           />
                        </td>
                     </tr>

                     <tr>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Trade Date:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "22px",
                                 padding: "0",
                                 minWidth: "90%",
                              }}
                              className="form-date-custom"
                              type="date"
                              id="dealTradeDate"
                              name="dealTradeDate"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealTradeDate}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FX" ||
                              this.props.txnType === "DEPOSIT" ||
                              this.props.txnType === "REPOS"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Settlement Date:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              type="date"
                              style={{
                                 height: "22px",
                                 padding: "0",
                                 width: "90%",
                              }}
                              className="form-date-custom"
                              id="dealValueDate"
                              name="dealValueDate"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealValueDate}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION" ||
                              this.props.txnType === "TRS"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Value Date:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              type="date"
                              style={{
                                 height: "22px",
                                 padding: "0",
                                 minWidth: "90%",
                              }}
                              className="form-date-custom"
                              id="dealValueDate"
                              name="dealValueDate"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealValueDate}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "OPTION" ||
                              this.props.txnType === "DEPOSIT" ||
                              this.props.txnType === "REPOS"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Maturity Date:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "22px",
                                 padding: "0",
                                 width: "60%",
                              }}
                              type="date"
                              className="form-date-custom"
                              id="dealMaturityDate"
                              name="dealMaturityDate"
                              onChange={this.numericChangeHandler}
                              value={this.state.dealMaturityDate}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Fee 1:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealFee1"
                              name="dealFee1"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealFee1}
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
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Fee 2:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealFee2"
                              name="dealFee2"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealFee2}
                           />
                           {this.state.showQuickFlag === "dealFee2" ? (
                              <QuickKey
                                 fieldName="dealFee2"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "FUTURE" ||
                              this.props.txnType === "OPTION"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Fee 3:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealFee3"
                              name="dealFee3"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealFee3}
                           />
                           {this.state.showQuickFlag === "dealFee3" ? (
                              <QuickKey
                                 fieldName="dealFee3"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>

                     <tr style={{ display: "none" }}>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Commission:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealCommission"
                              name="dealCommission"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealCommission}
                           />
                        </td>
                     </tr>
                     {/* <tr
                style={{ display: this.props.txnType === "BOND" ? "" : "none" }}
              >
                <td style={{ padding: "0.15rem" }}>
                  <Form.Label>Other Fee:</Form.Label>
                </td>
                <td style={{ padding: "0.15rem" }}>
                  <Form.Control type="text"
                    id="dealOtherFee"
                    name="dealOtherFee"
                    onChange={this.numericChangeHandler}
                    value={this.state.dealOtherFee}
                  />
                </td>
              </tr> */}
                     <tr style={{ display: "none" }}>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Tax:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealTax"
                              name="dealTax"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealTax}
                           />
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "BOND" ||
                              this.props.txnType === "CFD" ||
                              this.props.txnType === "EQUITY" ||
                              this.props.txnType === "DEPOSIT"
                                 ? ""
                                 : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Payment Amount:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealPaymentAmount"
                              name="dealPaymentAmount"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={
                                 this.state.dealTransactionCode === ""
                                    ? 0
                                    : this.state.dealPaymentAmount
                              }
                           />{" "}
                           {this.state.showQuickFlag === "dealPaymentAmount" ? (
                              <QuickKey
                                 fieldName="dealPaymentAmount"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                        <td
                           className="bondTd"
                           style={{
                              display:
                                 this.props.txnType === "BOND" ? "" : "none",
                              padding: "0.15rem",
                           }}
                        >
                           <Form.Label>Settlement Amount:</Form.Label>
                        </td>
                        <td
                           style={{
                              display:
                                 this.props.txnType === "BOND" ? "" : "none",
                              padding: "0.15rem",
                           }}
                        >
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealSettlementAmount"
                              name="dealSettlementAmount"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealSettlementAmount}
                           />{" "}
                           {this.state.showQuickFlag ===
                           "dealSettlementAmount" ? (
                              <QuickKey
                                 fieldName="dealSettlementAmount"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>

                     <tr
                        style={{
                           display:
                              this.props.txnType === "DEPOSIT" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Interest Rate:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealIntrestRate"
                              name="dealIntrestRate"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealIntrestRate}
                           />{" "}
                           {this.state.showQuickFlag === "dealIntrestRate" ? (
                              <QuickKey
                                 fieldName="dealIntrestRate"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "EQUITY" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Settlement Amount:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealSettlementAmount"
                              name="dealSettlementAmount"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealSettlementAmount}
                           />{" "}
                           {this.state.showQuickFlag ===
                           "dealSettlementAmount" ? (
                              <QuickKey
                                 fieldName="dealSettlementAmount"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                     <tr
                        style={{
                           display:
                              this.props.txnType === "OPTION" ? "" : "none",
                        }}
                     >
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Label>Current Value:</Form.Label>
                        </td>
                        <td style={{ padding: "0.15rem" }}>
                           <Form.Control
                              style={{
                                 height: "15px",
                                 width: "90%",
                              }}
                              type="text"
                              id="dealPaymentAmount"
                              name="dealPaymentAmount"
                              onChange={(event) => {
                                 this.numericChangeHandler(event);
                                 this.allowNumbersOnly(event);
                              }}
                              value={this.state.dealPaymentAmount}
                           />{" "}
                           {this.state.showQuickFlag === "dealPaymentAmount" ? (
                              <QuickKey
                                 fieldName="dealPaymentAmount"
                                 ref={this.resultRef}
                                 parent={this}
                              />
                           ) : (
                              <></>
                           )}
                        </td>
                     </tr>
                  </tbody>
               </Table>
            </div>
         </fieldset>
      );
   }
}
