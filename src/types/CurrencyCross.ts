export interface CurrencyCross {
  id: number;
  customerId: number;
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  decimals: number;
  factor: number;
  inverted: boolean;
  createdDate: Date;
}
