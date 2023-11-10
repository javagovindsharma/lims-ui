import { UserUtils } from "../lib/authenticationUtils";

export interface Transaction {
  transoriginNo: string;
  StaticRequested: string;
  action: string;
  bicCode: string;
  currency: string;
  isin: string;
  nominal: string;
  paymentAmount: string;
  transactionType: string;
}

export const initialTransaction: Transaction = {
  StaticRequested: "",
  action: "",
  bicCode: "",
  currency: "",
  isin: "",
  transactionType: "",
  nominal: "",
  paymentAmount: "",
  transoriginNo: "",
};

export interface allTransactionPopup {
  transoriginNo: any;
  StaticRequested: any;
  action: any;
  bicCode: any;
  currency: any;
  isin: any;
  nominal: any;
  paymentAmount: any;
  transactionType: any;
  transferredDate: any;
  createdDate: any;
  confirmedDate: any;
  deletedDate: any;
}

export interface searchMap {
  customerId: string;
  transoriginNo: any;
  createdDateFrom: any;
  createdDateTo: any;
  assetMgr: any;
  status: any;
  portfolioShort: any;
  counterpartyShort: any;
  tradeDateFrom: any;
  tradeDateTo: any;
  instrumentShort: any;
  nominal: any;
  externalTradeId: any;
  currency: any;
  instrumentType: any;
  otcInstrumentType: any;
  transactionType: any;
  baseCurrency: any;
  quoteCurrency: any;
  isin: any;
  sedol: any;
  quoteFactor: any;
  bloombergId: any;
  staticRequested: any;
  baseAmount: any;
  quoteAmount: any;
  transferred: any;
  otcInstrumentName: any;
  matrityDateFrom: any;
  matrityDateTo: any;
  index: any;
  positionId: any;
  otcInstrumentId: any;
  otcTransactionCode: any;
  quantity: any;
}

export const initialSearchMap: searchMap = {
  customerId: "",
  transoriginNo: "",
  createdDateFrom: "",
  createdDateTo: "",
  assetMgr: "",
  status: [],
  portfolioShort: "",
  counterpartyShort: "",
  tradeDateFrom: "",
  tradeDateTo: "",
  instrumentShort: "",
  nominal: "",
  externalTradeId: "",
  currency: "",
  instrumentType: "",
  otcInstrumentType: "",
  transactionType: [],
  baseCurrency: "",
  quoteCurrency: "",
  isin: "",
  sedol: "",
  quoteFactor: "",
  bloombergId: "",
  staticRequested: "",
  baseAmount: "",
  quoteAmount: "",
  transferred: "",
  otcInstrumentName: "",
  matrityDateFrom: "",
  matrityDateTo: "",
  index: "",
  otcInstrumentId: "",
  otcTransactionCode: "",
  positionId: "",
  quantity: "",
};

export const initialTransactionPopUp: allTransactionPopup = {
  StaticRequested: "",
  action: "",
  bicCode: "",
  currency: "",
  isin: "",
  transactionType: "",
  nominal: "",
  paymentAmount: "",
  transoriginNo: "",
  transferredDate: "",
  createdDate: "",
  confirmedDate: "",
  deletedDate: "",
};

export interface Portfolio {
  subPortfolios: [];
  portfolioId: number;
  customerId: string;
  portfolioName: string;
  portfolioShort: string;
  lei: string;
  portfolioSystem: string;
  portfolionameFxall: string;
  autoconfirm: boolean;
  sourceDestination: string;
  pftradeMethod: string;
  scdunid: number;
  createdDate: string;
  modifiedDate: string;
}

export interface SubPortfolio {
  id: number;
  customerId: number;
  subPortfolioName: string;
  subPortfolioShort: string;
  portfolioSystem: string;
  baseSysId: string;
  portfolioBaseSysId: string;
  chgts: any;
  touch: any;
  created: any;
  modified: any;
}
export interface transactionBackend {
  transoriginNo: number;
  bloombergId: string;
  externalTradeId: string;
  valueDate: Date;
  portfolioName: string;
  instrumentShort: string;
  transactionCode: string;
  counterpartyName: string;
  counterpartyShort: string;
  fileName: string;
  currency: string;
  fee1: number;
  fee2: number;
  assetMgr: string;
  nominal: number;
  safeAccount: string;
  tradeDate: Date;
  exchange: string;
  action: string;
  instrumentName: string;
  ric: string;
  portfolioShort: string;
  sedol: string;
  cusip: string;
  paymentAmount: number;
  portfolioSystem: string;
  bicCode: string;
  instrumentType: string;
  isin: string;
  transactionType: string;
  price: number;
  createdDate: Date;
  modifiedDate: Date;
  CustomerId: number;
  StaticRequested: boolean;
}

export interface Currency {
  id: number;
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  decimals: number;
  factor: number;
  inverted: boolean;
  createdDate: Date;
}

export const initialPortfolio: Portfolio = {
  portfolioId: 0,
  customerId: "",
  portfolioName: "",
  portfolioShort: "",
  lei: "",
  portfolioSystem: "",
  portfolionameFxall: "",
  autoconfirm: false,
  sourceDestination: "",
  pftradeMethod: "",
  scdunid: 0,
  createdDate: "",
  modifiedDate: "",
  subPortfolios: [],
};

export const initialSubPortfolio: SubPortfolio = {
  id: 0,
  customerId: 0,
  subPortfolioName: "",
  subPortfolioShort: "",
  portfolioSystem: "",
  baseSysId: "",
  portfolioBaseSysId: "",
  chgts: "",
  touch: "",
  created: "",
  modified: "",
};

export interface transactionActionObject {
  customerId: string;
  assetMgr: string;
  transoriginNo: number;
  action: string;
  externalTradeId?: string;
  authorDeleted?: string;
  authorConfirmed?: string;
}

export interface txnActionResponse {
  id: string;
  status: string;
  msg: string;
}

export const initialTxnActionResponse = { id: "", status: "", msg: "" };

export const initialReportSearchMap: reportSearchMap = {
  received: "",
  assetMgr: UserUtils.getUser()?.assetManager,
  fileName: "",
};

export interface reportSearchMap {
  received: any;
  assetMgr: any;
  fileName: string;
}

export const initialSearchHistoryMap: searchMap = {
  customerId: "",
  transoriginNo: 0,
  createdDateFrom: "",
  createdDateTo: "",
  assetMgr: "",
  status: [],
  portfolioShort: "",
  counterpartyShort: "",
  tradeDateFrom: "",
  tradeDateTo: "",
  instrumentShort: "",
  nominal: "",
  externalTradeId: "",
  currency: "",
  instrumentType: "",
  otcInstrumentType: "",
  transactionType: [],
  baseCurrency: "",
  quoteCurrency: "",
  isin: "",
  sedol: "",
  quoteFactor: "",
  bloombergId: "",
  staticRequested: "",
  baseAmount: "",
  quoteAmount: "",
  transferred: "",
  otcInstrumentName: "",
  matrityDateFrom: "",
  matrityDateTo: "",
  index: "",
  otcInstrumentId: "",
  otcTransactionCode: "",
  positionId: "",
  quantity: "",
};
