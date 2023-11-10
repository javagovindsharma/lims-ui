export interface Counterparty {
  alias: [];
  baseSysId: string;
  chgts: string;
  counterpartyBicCode: string;
  counterpartyLei: string;
  counterpartyName: string;
  counterpartyShort: string;
  createdDate: string;
  customerId: 0;
  id: 0;
  modifiedDate: string;
  profile: [];
  touched: string;
}

export interface CounterpartyInputs {
  CounterpartyName: string;
  CounterpartyShort: string;
  BicCode: string;
}

export const intialCounterparty: CounterpartyInputs = {
  CounterpartyName: "",
  BicCode: "",
  CounterpartyShort: "",
};
