import { transactionBackend } from "../types/Transaction";
import { UserUtils } from "./authenticationUtils";
import moment from "moment";

export function convertArrival(
   arrivalPriceDateTime: any,
   arrivalTimeZone: any
) {
   var date = moment.parseZone(arrivalPriceDateTime);
   if (date.isValid()) {
      var arrivalTime = moment
         .tz(arrivalPriceDateTime + arrivalTimeZone, "Europe/London")
         .format();
      return (
         arrivalTime.substring(0, arrivalTime.length - 1) +
         ".000" +
         arrivalTime.substring(arrivalTime.length - 1, arrivalTime.length)
      );
   } else {
      return "";
   }
}

export function transactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const portfolioRef = transactionObject.portfolioRef?.current.state;
   const counterpartyRef = transactionObject.counterpartyRef?.current.state;
   const miscRef = transactionObject.miscRef?.current.state;
   const dealRef = transactionObject.dealInformationRef?.current.state;
   const instrumentRef = transactionObject.instrumentRef?.current.state;
   const arrivalRef = transactionObject.arrivalRef?.current.state;

   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         StaticRequested: instrumentRef?.StaticRequested,
         PortfolioName: portfolioRef?.portfolioName,
         PortfolioShort: portfolioRef?.portfolioShort,
         SubPortfolioName: portfolioRef?.subPortfolioShort,
         SubPortfolioShort: portfolioRef?.subPortfolioShort,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,
         BrokerName: counterpartyRef.brokerName,
         BrokerShort: counterpartyRef.brokerShort,
         BrokerBicCode: counterpartyRef.brokercounterpartyBicCode,
         InstrumentShort: instrumentRef?.instrumentShort,
         InstrumentName: instrumentRef?.instrumentName,
         Sedol: instrumentRef?.sedol,
         InstrumentType:
            dealRef?.dealFXType === ""
               ? instrumentRef?.instrumentType
               : dealRef?.dealFXType,
         Isin: instrumentRef?.instrumentIsin,
         Exchange: instrumentRef?.instrumentExchange,
         CouponRate: dealRef?.instrumentCouponRate,
         Nominal: Number(
            dealRef?.dealNominal === ""
               ? dealRef?.dealQuantity
               : dealRef?.dealNominal
         ),
         FaceValue: dealRef?.faceValue,
         PoolFactor: Number(dealRef?.dealPoolFactor),
         QuoteFactor: Number(dealRef?.dealQuoteFactor),
         Price: Number(dealRef?.dealPrice),
         Yield: Number(dealRef?.dealYield),
         AccruedInterest: Number(dealRef?.dealAccruedInterest),
         CleanValue: Number(dealRef?.dealCleanValue),
         Currency: dealRef?.dealCurrency,
         SettlementCurrent: dealRef?.dealSettlementCurrent,
         // PriceCurrency: dealRef?.dealPriceCurrency,
         QuoteCurrency: dealRef?.dealquoteCurrency,
         TradeDate: moment.parseZone(dealRef?.dealTradeDate).isValid()
            ? moment.parseZone(dealRef?.dealTradeDate).format("YYYY-MM-DD")
            : "",
         ValueDate: moment.parseZone(dealRef?.dealValueDate).isValid()
            ? moment.parseZone(dealRef?.dealValueDate).format("YYYY-MM-DD")
            : "",
         MaturityDate: moment.parseZone(dealRef?.dealMaturityDate).isValid()
            ? moment.parseZone(dealRef?.dealMaturityDate).format("YYYY-MM-DD")
            : "",
         Fee1: Number(dealRef?.dealFee1),
         Fee2: Number(dealRef?.dealFee2),
         Fee3: Number(dealRef?.dealFee3),
         //  Commission: Number(dealRef?.dealCommission),
         //  OtherFee: Number(dealRef?.dealOtherFee),
         //  Tax: Number(dealRef?.dealTax),
         PaymentAmount: Number(dealRef?.dealPaymentAmount),
         SettlementAmount: Number(dealRef?.dealSettlementAmount),
         TransactionCode: dealRef?.dealTransactionCode,
         ContractSize: Number(dealRef?.dealContractSize),
         SettlementDate: moment.parseZone(dealRef?.dealValueDate).isValid()
            ? moment.parseZone(dealRef?.dealValueDate).format("YYYY-MM-DD")
            : "",
         fxType: dealRef?.dealFXType, //for fx
         Lots: Number(dealRef?.dealLots),
         Cls: Number(dealRef?.dealCLS),
         CurrencyPair: Number(dealRef?.dealCurrencyPair),
         SpotRate: Number(dealRef?.dealSpotRate),
         Tics: Number(dealRef?.dealTics),
         ForwardRate: Number(dealRef?.dealForwardRate),
         BaseAmount: Number(dealRef?.dealBaseAmount),
         BaseCurrency: dealRef?.dealBaseCurrency,
         QuoteAmount: Number(dealRef?.dealQuoteAmount),
         BaseCurrencyAmountSpot: Number(dealRef?.dealBaseCurrencyAmountSpot),
         BaseCurrencyAmountForward: Number(
            dealRef?.dealBaseCurrencyAmountForward
         ),
         PriceCurrencyAmountSpot: Number(dealRef?.dealPriceCurrencyAmountSpot),
         PriceCurrencyAmountForward: Number(
            dealRef?.dealPriceCurrencyAmountForward
         ),
         Quantity: Number(dealRef?.dealQuantity),
         PriceCurrency: dealRef?.dealPriceCurrency,
         PriceOrYield: dealRef?.dealPriceOrYield,
         Commission: Number(dealRef?.dealCommission),
         OtherFee: Number(dealRef?.dealOtherFee),
         Tax: Number(dealRef?.dealTax),
         ExternalTradeId: miscRef.externalTradeId,
         Comments: miscRef.comments,
         Uti: miscRef.uti,
         ArrivalPrice: arrivalRef?.arrivalPrice,
         ArrivalTime: convertArrival(
            arrivalRef?.arrivalPriceDateTime === undefined
               ? ""
               : arrivalRef?.arrivalPriceDateTime,
            arrivalRef?.arrivalTimeZone === undefined
               ? ""
               : arrivalRef?.arrivalTimeZone
         ),
      },
      customerId: UserUtils.getUser()?.customerId,
   };

   return transactionBackend;
}

export function bondTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const portfolioRef = transactionObject.portfolioRef?.current.state;
   const counterpartyRef = transactionObject.counterpartyRef?.current.state;
   const miscRef = transactionObject.miscRef?.current.state;
   const dealRef = transactionObject.dealInformationRef?.current.state;
   const instrumentRef = transactionObject.instrumentRef?.current.state;
   const arrivalRef = transactionObject.arrivalRef?.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         StaticRequested: instrumentRef?.StaticRequested,
         PortfolioName: portfolioRef?.portfolioName,
         PortfolioShort: portfolioRef?.portfolioShort,
         SubPortfolioName: portfolioRef?.subPortfolioShort,
         SubPortfolioShort: portfolioRef?.subPortfolioShort,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,
         BrokerName: counterpartyRef.brokerName,
         BrokerShort: counterpartyRef.brokerShort,
         BrokerBicCode: counterpartyRef.brokercounterpartyBicCode,
         InstrumentShort: instrumentRef?.instrumentShort,
         InstrumentName: instrumentRef?.instrumentName,
         Sedol: instrumentRef?.sedol,
         InstrumentType:
            dealRef?.dealFXType === ""
               ? instrumentRef?.instrumentType
               : dealRef?.dealFXType,
         Isin: instrumentRef?.instrumentIsin,
         Exchange: instrumentRef?.instrumentExchange,
         CouponRate: dealRef?.instrumentCouponRate,
         Nominal: Number(
            dealRef?.dealNominal === ""
               ? dealRef?.dealQuantity
               : dealRef?.dealNominal
         ),
         FaceValue: dealRef?.faceValue,
         PoolFactor: Number(dealRef?.dealPoolFactor),
         QuoteFactor: Number(dealRef?.dealQuoteFactor),
         Price: Number(dealRef?.dealPrice),
         Yield: Number(dealRef?.dealYield),
         AccruedInterest: Number(dealRef?.dealAccruedInterest),
         CleanValue: Number(dealRef?.dealCleanValue),
         Currency:
            instrumentRef.newSecurityCurrency !== ""
               ? instrumentRef.newSecurityCurrency
               : dealRef?.dealCurrency,
         SettlementCurrent: dealRef?.dealSettlementCurrent,
         // PriceCurrency: dealRef?.dealPriceCurrency,
         QuoteCurrency: dealRef?.dealquoteCurrency,
         TradeDate: moment.parseZone(dealRef?.dealTradeDate).isValid()
            ? moment.parseZone(dealRef?.dealTradeDate).format("YYYY-MM-DD")
            : "",
         MaturityDate: moment.parseZone(dealRef?.dealMaturityDate).isValid()
            ? moment.parseZone(dealRef?.dealMaturityDate).format("YYYY-MM-DD")
            : "",
         Fee1: Number(dealRef?.dealFee1),
         Fee2: Number(dealRef?.dealFee2),
         Fee3: Number(dealRef?.dealFee3),
         //  Commission: Number(dealRef?.dealCommission),
         //  OtherFee: Number(dealRef?.dealOtherFee),
         //  Tax: Number(dealRef?.dealTax),
         PaymentAmount: Number(dealRef?.dealPaymentAmount),
         SettlementAmount: Number(dealRef?.dealSettlementAmount),
         TransactionCode: dealRef?.dealTransactionCode,
         ContractSize: Number(dealRef?.dealContractSize),
         SettlementDate: moment.parseZone(dealRef?.dealValueDate).isValid()
            ? moment.parseZone(dealRef?.dealValueDate).format("YYYY-MM-DD")
            : "", // for futures
         fxType: dealRef?.dealFXType, //for fx
         Lots: Number(dealRef?.dealLots),
         Cls: Number(dealRef?.dealCLS),
         CurrencyPair: Number(dealRef?.dealCurrencyPair),
         SpotRate: Number(dealRef?.dealSpotRate),
         Tics: Number(dealRef?.dealTics),
         ForwardRate: Number(dealRef?.dealForwardRate),
         BaseAmount: Number(dealRef?.dealBaseAmount),
         BaseCurrency: dealRef?.dealBaseCurrency,
         QuoteAmount: Number(dealRef?.dealQuoteAmount),
         BaseCurrencyAmountSpot: Number(dealRef?.dealBaseCurrencyAmountSpot),
         BaseCurrencyAmountForward: Number(
            dealRef?.dealBaseCurrencyAmountForward
         ),
         PriceCurrencyAmountSpot: Number(dealRef?.dealPriceCurrencyAmountSpot),
         PriceCurrencyAmountForward: Number(
            dealRef?.dealPriceCurrencyAmountForward
         ),
         Quantity: Number(dealRef?.dealQuantity),
         PriceCurrency: dealRef?.dealPriceCurrency,
         PriceOrYield: dealRef?.dealPriceOrYield,
         Commission: Number(dealRef?.dealCommission),
         OtherFee: Number(dealRef?.dealOtherFee),
         Tax: Number(dealRef?.dealTax),
         ExternalTradeId: miscRef.externalTradeId,
         Comments: miscRef.comments,
         Uti: miscRef.uti,
         ArrivalPrice: arrivalRef.arrivalPrice,
         ArrivalTime: convertArrival(
            arrivalRef?.arrivalPriceDateTime === undefined
               ? ""
               : arrivalRef?.arrivalPriceDateTime,
            arrivalRef?.arrivalTimeZone === undefined
               ? ""
               : arrivalRef?.arrivalTimeZone
         ),
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}

export function backendToFrontConvertor(
   backendTransaction: transactionBackend | undefined
) {
   var frontEndTransactionObj = {
      type: backendTransaction?.transactionType,
      dealPaymentAmount: backendTransaction?.paymentAmount,
      // newSecurityIsin: // check with Katarina as there is no ISIN in manual transaction
      dealFee1: backendTransaction?.fee1,
      dealFee2: backendTransaction?.fee2,
      portfolioText: backendTransaction?.portfolioName,
      bicCode: backendTransaction?.bicCode,
      dealPrice: backendTransaction?.price,
      dealCurrency: backendTransaction?.currency,
   };
   return frontEndTransactionObj;
}

export function frontendActionConverter(transactionState: any, action: any) {
   var transactionObject;

   transactionObject = {
      transoriginNo: transactionState.transoriginNo,
      customerId: transactionState.customerId,
      assetMgr: transactionState.assetMgr,
      fee1: transactionState.fee1,
      fee2: transactionState.fee2,
      fee3: transactionState.fee3,
      action: action,
   };

   return transactionObject;
}
export function trsTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const trsPortfolioRef = transactionObject.trsPortfolioRef.current.state;
   const counterpartyRef = transactionObject.counterpartyRef.current.state;
   const miscRef = transactionObject.miscRef.current.state;
   const otcRef = transactionObject.otcRef.current.state;
   const dealRef = transactionObject.trsDealInformationRef.current.state;
   const detailsRef = transactionObject.swapDescriptionRef.current.state;
   const positionRef = transactionObject.openPositionRef.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         PortfolioName: trsPortfolioRef.portfolioName,
         PortfolioShort: trsPortfolioRef.portfolioShort,
         SubPortfolioName: trsPortfolioRef.subPortfolioShort,
         SubPortfolioShort: trsPortfolioRef.subPortfolioShort,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager,
         OtcTransactionCode: transactionState.TRS_Increase_Decrease,
         TransactionCode: transactionState.TRS_Increase_Decrease,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,
         BrokerName: counterpartyRef.brokerName,
         BrokerShort: counterpartyRef.brokerShort,
         BrokerBicCode: counterpartyRef.brokercounterpartyBicCode,
         SecurityId: positionRef.trs_securityId,
         SecurityName: positionRef.trs_securityName,
         Novation: positionRef.novation,

         DayCountleg1: detailsRef.swapDayCountlegno1,
         DayCountleg2: detailsRef.swapDayCountlegno2,
         Frequencyleg1: detailsRef.swapFrequencylegno1,
         Frequencyleg2: detailsRef.swapFrequencylegno2,
         Currencyleg1: detailsRef.swapCurrencylegno1,
         Currencyleg2: detailsRef.swapCurrencylegno2,
         PaidReceiveCurrencyleg1: detailsRef.swapPayReceivelegno1,
         PaidReceiveCurrencyleg2: detailsRef.swapPayReceivelegno2,
         RateType: detailsRef.swapRateTypeleg,
         InstrumentType: detailsRef.underlyingSecType,
         SpreadRate: detailsRef.swapSpreadRateleg,
         UnderlyingSecCurrency: detailsRef.swapUnderlyingSecCurrency,
         RefRate: detailsRef.swapReferenceRateleg,
         Sedol: detailsRef.underlyingInstrumentSedol,
         BloombergId: detailsRef.underlyingInstrumentBloombergId,
         InstrumentName: detailsRef.underlyingInstrumentName,
         InstrumentShort: detailsRef.underlyingInstrumentShort,
         MaturityDate: moment
            .parseZone(detailsRef.swapFinalValuationMaturityDate)
            .isValid()
            ? moment
                 .parseZone(detailsRef.swapFinalValuationMaturityDate)
                 .format("YYYY-MM-DD")
            : "",
         InitialValuationDate: moment
            .parseZone(detailsRef.swapStartValuation)
            .isValid()
            ? moment
                 .parseZone(detailsRef.swapStartValuation)
                 .format("YYYY-MM-DD")
            : "",
         FirstValuationDate: moment
            .parseZone(detailsRef.swapFirstValuation)
            .isValid()
            ? moment
                 .parseZone(detailsRef.swapFirstValuation)
                 .format("YYYY-MM-DD")
            : "",

         TradeDate: moment.parseZone(dealRef.dealTradeDate).isValid()
            ? moment.parseZone(dealRef.dealTradeDate).format("YYYY-MM-DD")
            : "",
         ValueDate: moment.parseZone(dealRef.dealValueDate).isValid()
            ? moment.parseZone(dealRef.dealValueDate).format("YYYY-MM-DD")
            : "",
         NoofUnderlyingUnits: dealRef.dealNumberOfUnderlyingUnitslegno1,
         Price: dealRef.dealUnderlyingPricelegno1,
         Currency: dealRef.dealCurrencylegno1,
         CurrencyRate: dealRef.dealCurrencyRate,
         UnderlyingCurrency: dealRef.dealUnderlyingCurrencylegno1,
         NotionalAmount: dealRef.dealNationalAmountlegno1,

         Usinamespace: otcRef.usinamespace,
         Uniqueswapidentifier: otcRef.uniqueswapidentifier,

         Comments: miscRef.comments,
         ExternalTradeId: miscRef.externalTradeId,
         Uti: miscRef.uti,
         PositionId: miscRef.managerUniqueSwapId,
         Admincomments: miscRef.admincomments,
         OtcInstrumentId: transactionState.otcInstrumentId,
         OtcInstrumentName: transactionState.otcInstrumentName,
         OtcInstrumentType: transactionState.otcInstrumentType,
         OtcInstrumentNumber: transactionState.otcInstrumentNumber,
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}

export function irsTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   const transactionState = transactionObject.state;
   const irsPortfolioRef = transactionObject.irsPortfolioRef.current.state;
   const counterpartyRef = transactionObject.counterpartyRef.current.state;
   const miscRef = transactionObject.miscRef.current.state;
   const otcRef = transactionObject.otcRef.current.state;
   const dealRef = transactionObject.irsDealInformationRef.current.state;
   const detailsRef = transactionObject.deatilsRef.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         PortfolioName: irsPortfolioRef.portfolioName,
         PortfolioShort: irsPortfolioRef.portfolioShort,
         SubPortfolioName: irsPortfolioRef.subPortfolioShort,
         SubPortfolioShort: irsPortfolioRef.subPortfolioShort,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager,
         OtcTransactionCode: transactionState.TRS_Increase_Decrease,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,
         BrokerName: counterpartyRef.brokerName,
         BrokerShort: counterpartyRef.brokerShort,
         BrokerBicCode: counterpartyRef.brokercounterpartyBicCode,

         FixedRate: detailsRef.fixedRate,
         Index: transactionState.index,
         Daycount: detailsRef.daycount,
         InitialRate: detailsRef.initialRate,
         NotionalAmount: detailsRef.notional,
         MaturityDate: moment.parseZone(detailsRef.maturityDate).isValid()
            ? moment.parseZone(detailsRef.maturityDate).format("YYYY-MM-DD")
            : "",
         Frequency: detailsRef.frequency,
         Tenor: transactionState.indexTenor,
         Currency: transactionState.currency,
         Spread: detailsRef.spread,
         otcInstrumentType: transactionState.instrumentType,

         TradeDate: moment.parseZone(dealRef.dealTradeDate).isValid()
            ? moment.parseZone(dealRef.dealTradeDate).format("YYYY-MM-DD")
            : "",
         ValueDate: moment.parseZone(dealRef.dealEffectiveDate).isValid()
            ? moment.parseZone(dealRef.dealEffectiveDate).format("YYYY-MM-DD")
            : "",
         Cleared: dealRef.cleared,

         Usinamespace: otcRef.usinamespace,
         Uniqueswapidentifier: otcRef.uniqueswapidentifier,

         Comments: miscRef.comments,
         ExternalTradeId: miscRef.externalTradeId,
         Uti: miscRef.uti,
         Admincomments: miscRef.admincomments,
         OtcInstrumentId: transactionState.otcInstrumentId,
         OtcInstrumentName: transactionState.otcInstrumentName,
         OtcInstrumentType: transactionState.otcInstrumentType,
         OtcInstrumentNumber: transactionState.otcInstrumentNumber,
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}

export function reposTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const portfolioRef = transactionObject.portfolioRef?.current.state;
   const counterpartyRef = transactionObject.counterpartyRef?.current.state;
   const miscRef = transactionObject.miscRef?.current.state;
   const dealRef = transactionObject.dealInformationRef?.current.state;
   const instrumentRef = transactionObject.instrumentRef?.current.state;
   const arrivalRef = transactionObject.arrivalRef?.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         StaticRequested: instrumentRef?.StaticRequested,
         PortfolioName: portfolioRef?.portfolioName,
         PortfolioShort: portfolioRef?.portfolioShort,
         SubPortfolioName: portfolioRef?.subPortfolioShort,
         SubPortfolioShort: portfolioRef?.subPortfolioShort,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,
         BrokerName: counterpartyRef.brokerName,
         BrokerShort: counterpartyRef.brokerShort,
         BrokerBicCode: counterpartyRef.brokercounterpartyBicCode,
         InstrumentShort: instrumentRef?.instrumentShort,
         InstrumentName: instrumentRef?.instrumentName,
         Sedol: instrumentRef?.sedol,
         SettlementCurrent: instrumentRef?.settlementCurrency,
         InstrumentType:
            dealRef?.dealFXType === ""
               ? instrumentRef?.instrumentType
               : dealRef?.dealFXType,
         Isin: instrumentRef?.instrumentIsin,
         Exchange: instrumentRef?.instrumentExchange,
         CouponRate: dealRef?.instrumentCouponRate,
         Nominal: Number(
            dealRef?.dealNominal === ""
               ? dealRef?.dealQuantity
               : dealRef?.dealNominal
         ),
         FaceValue: dealRef?.faceValue,
         PoolFactor: Number(dealRef?.dealPoolFactor),
         QuoteFactor: Number(dealRef?.dealQuoteFactor),
         Price: Number(dealRef?.dealPrice),
         Yield: Number(dealRef?.dealYield),
         AccruedInterest: Number(dealRef?.dealAccruedInterest),
         CleanValue: Number(dealRef?.dealCleanValue),
         Currency:
            instrumentRef.newSecurityCurrency !== ""
               ? instrumentRef.newSecurityCurrency
               : dealRef?.dealCurrency,
         QuoteCurrency: dealRef?.dealquoteCurrency,
         TradeDate: moment.parseZone(dealRef.dealTradeDate).isValid()
            ? moment.parseZone(dealRef.dealTradeDate).format("YYYY-MM-DD")
            : "",
         MaturityDate: moment.parseZone(dealRef.dealMaturityDate).isValid()
            ? moment.parseZone(dealRef.dealMaturityDate).format("YYYY-MM-DD")
            : "",
         Fee1: Number(dealRef?.dealFee1),
         Fee2: Number(dealRef?.dealFee2),
         Fee3: Number(dealRef?.dealFee3),
         PaymentAmount: Number(dealRef?.dealPaymentAmount),
         SettlementAmount: Number(dealRef?.dealSettlementAmount),
         TransactionCode: dealRef?.dealTransactionCode,
         ContractSize: Number(dealRef?.dealContractSize),
         SettlementDate: moment.parseZone(dealRef?.dealValueDate).isValid()
            ? moment.parseZone(dealRef?.dealValueDate).format("YYYY-MM-DD")
            : "", // for futures
         fxType: dealRef?.dealFXType, //for fx
         Lots: Number(dealRef?.dealLots),
         Cls: Number(dealRef?.dealCLS),
         CurrencyPair: Number(dealRef?.dealCurrencyPair),
         SpotRate: Number(dealRef?.dealSpotRate),
         Tics: Number(dealRef?.dealTics),
         ForwardRate: Number(dealRef?.dealForwardRate),
         BaseAmount: Number(dealRef?.dealBaseAmount),
         BaseCurrency: dealRef?.dealBaseCurrency,
         QuoteAmount: Number(dealRef?.dealQuoteAmount),
         BaseCurrencyAmountSpot: Number(dealRef?.dealBaseCurrencyAmountSpot),
         BaseCurrencyAmountForward: Number(
            dealRef?.dealBaseCurrencyAmountForward
         ),
         PriceCurrencyAmountSpot: Number(dealRef?.dealPriceCurrencyAmountSpot),
         PriceCurrencyAmountForward: Number(
            dealRef?.dealPriceCurrencyAmountForward
         ),
         Quantity: Number(dealRef?.dealQuantity),
         PriceCurrency: dealRef?.dealPriceCurrency,
         PriceOrYield: dealRef?.dealPriceOrYield,
         Commission: Number(dealRef?.dealCommission),
         OtherFee: Number(dealRef?.dealOtherFee),
         Tax: Number(dealRef?.dealTax),
         ExternalTradeId: miscRef.externalTradeId,
         Comments: miscRef.comments,
         Uti: miscRef.uti,
         ArrivalPrice: arrivalRef.arrivalPrice,
         ArrivalTime: convertArrival(
            arrivalRef?.arrivalPriceDateTime === undefined
               ? ""
               : arrivalRef?.arrivalPriceDateTime,
            arrivalRef?.arrivalTimeZone === undefined
               ? ""
               : arrivalRef?.arrivalTimeZone
         ),
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}

export function depositTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const portfolioRef = transactionObject.portfolioRef?.current.state;
   const miscRef = transactionObject.miscRef?.current.state;
   const dealRef = transactionObject.dealInformationRef?.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,
         PortfolioName: portfolioRef?.portfolioName,
         PortfolioShort: portfolioRef?.portfolioShort,
         SubPortfolioName: portfolioRef?.subPortfolioShort,
         SubPortfolioShort: portfolioRef?.subPortfolioShort,
         CounterpartyBicCode: transactionState.counterpartyBicCode,
         CounterpartyShort: transactionState.counterpartyShort,
         CounterpartyName: transactionState.counterpartyName,
         InstrumentShort: transactionState?.instrumentShort,
         InstrumentName: transactionState?.instrumentName,
         InstrumentType: transactionState?.instrumentType,
         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManager
               : UserUtils.getUser()?.assetManager,
         CustomerId: UserUtils.getUser()?.customerId,
         TradeDate: moment.parseZone(dealRef.dealTradeDate).isValid()
            ? moment.parseZone(dealRef.dealTradeDate).format("YYYY-MM-DD")
            : "",
         ValueDate: moment.parseZone(dealRef.dealValueDate).isValid()
            ? moment.parseZone(dealRef.dealValueDate).format("YYYY-MM-DD")
            : "",
         MaturityDate: moment.parseZone(dealRef.dealMaturityDate).isValid()
            ? moment.parseZone(dealRef.dealMaturityDate).format("YYYY-MM-DD")
            : "",
         PaymentAmount: Number(dealRef?.dealPaymentAmount),
         TransactionCode: dealRef?.dealTransactionCode,
         Currency:
            transactionState.newSecurityCurrency !== ""
               ? transactionState.newSecurityCurrency
               : transactionState?.instrumentQoutedCurrency,
         InterestRate: Number(dealRef?.dealIntrestRate),
         SettlementDate: moment.parseZone(dealRef.dealValueDate).isValid()
            ? moment.parseZone(dealRef?.dealValueDate).format("YYYY-MM-DD")
            : "", // for futures
         ExternalTradeId: miscRef.externalTradeId,
         Comments: miscRef.comments,
         Uti: miscRef.uti,
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}

export function CDSTransactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {
   //  const transactionState = transaction.state;
   const transactionState = transactionObject.state;
   const trsPortfolioRef = transactionObject.portfolioRef.current.state;
   const counterpartyRef = transactionObject.counterpartyRef.current.state;
   const miscRef = transactionObject.miscRef.current.state;
   const otcRef = transactionObject.otcRef.current.state;
   const arrivalRef = transactionObject.arrivalRef.current.state;

   const dealRef = transactionObject.dealInformationRef.current.state;
   const transactionBackend = {
      dataMap: {
         Action: action,
         TransactionType: type,

         AssetMgr:
            UserUtils.getUser()?.assetManager === undefined
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager === ""
               ? transactionState.assetManagerName
               : UserUtils.getUser()?.assetManager,

         OtcInstrumentType: transactionState.otcIntrumenetType,
         OtcTransactionCode: transactionState.transactionCode,
         CustomerId: UserUtils.getUser()?.customerId,
         CounterpartyBicCode: counterpartyRef.counterpartyBicCode,
         CounterpartyShort: counterpartyRef.counterpartyShort,
         CounterpartyName: counterpartyRef.counterpartyName,

         PortfolioName: trsPortfolioRef.portfolioName,
         PortfolioShort: trsPortfolioRef.portfolioShort,
         SubPortfolioName: trsPortfolioRef.subPortfolioShort,
         SubPortfolioShort: trsPortfolioRef.subPortfolioShort,

         TransactionCode: dealRef.dealTransactionCode,
         TradeDate: moment.parseZone(dealRef.dealTradeDate).isValid()
            ? moment.parseZone(dealRef.dealTradeDate).format("YYYY-MM-DD")
            : "",
         Index: dealRef.dealIndex,
         InstrumentShort: dealRef.dealOTCInstrumentShort,
         Fee1: dealRef.dealFee1,
         MaturityDate: moment.parseZone(dealRef.dealMaturityDate).isValid()
            ? moment.parseZone(dealRef.dealMaturityDate).format("YYYY-MM-DD")
            : "",
         Currency: dealRef.dealCurrency,
         NotionalAmount: dealRef.dealNationalAmount,
         QuoteType: dealRef.dealQuoteType,

         Usinamespace: otcRef.usinamespace,
         Uniqueswapidentifier: otcRef.uniqueswapidentifier,

         Comments: miscRef.comments,
         ExternalTradeId: miscRef.externalTradeId,
         Uti: miscRef.uti,
         PositionId: miscRef.managerUniqueSwapId,
         Admincomments: miscRef.admincomments,
         OtcInstrumentId: dealRef.dealOTCInstrumentId,
         OtcInstrumentName: dealRef.dealOTCInstrumentName,
         ArrivalPrice: arrivalRef.arrivalPrice,
         ArrivalTime: convertArrival(
            arrivalRef?.arrivalPriceDateTime === undefined
               ? ""
               : arrivalRef?.arrivalPriceDateTime,
            arrivalRef?.arrivalTimeZone === undefined
               ? ""
               : arrivalRef?.arrivalTimeZone
         ),
      },
      customerId: UserUtils.getUser()?.customerId,
   };
   return transactionBackend;
}
