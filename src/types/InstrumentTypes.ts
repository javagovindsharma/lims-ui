export interface Instrument {
  id: number;
  customerId: number;
  isin: string;
  cusip: string;
  sedol: string;
  instrumentName: string;
  instrumentShort: string;
  instrumentType: string;
  ric: string;
  currency: string;
  bloombergId: string;
  exchange: string;
  baseSysId: string;
  chgts?: Date;
  profile?: any[];
  touched?: Date;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface InstrumentEquity {
  id: number;
  customerId: number;
  isin: string;
  cusip: string;
  sedol: string;
  instrumentName: string;
  instrumentShort: string;
  instrumentType: string;
  ric: string;
  currency: string;
  bloombergId: string;
  exchange: string;
  baseSysId: string;
  chgts: string;
  profile: any[];
  touched: string;
  createdDate: string;
  modifiedDate: string;
  transactionType: string;
}

export interface InstrumentBond {
  id: number;
  instrumentShort: string;
  instrumentName: string;
  instrumentType: string;
  currency: string;
  quoteFactor?: number;
  isin: string;
  sedol: string;
  bloombergId: string;
  baseSysId: string;
  modifiedDate?: Date;
}
