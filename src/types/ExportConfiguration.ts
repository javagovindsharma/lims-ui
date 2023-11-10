import { getLocaleDateString } from "./ImportCongurations";

export interface exportField {
   dataType: string;
   maxFractionDigits: any;
   minFractionDigits: any;
   dateFormat: any;
   staticValue: any;
   exportValue: any;
   transformers: ReplaceValues[];
   type: any;
   fieldName: any;
   header: any;
   sortOrder: any;
   grouping: boolean;
   quoteValue: boolean;
}
export interface ReplaceValues {
   from: string;
   to: string;
}
export const initialExportField: exportField = {
   dataType: "",
   maxFractionDigits: 10,
   minFractionDigits: 0,
   dateFormat: "yyyy-MM-dd",
   staticValue: "",
   exportValue: "FIELD_VALUE",
   transformers: [],
   type: "",
   fieldName: "",
   header: "",
   sortOrder: 0,
   grouping: false,
   quoteValue: false,
};

export interface exportConfiguration {
   id: any;
   customerId: number;
   assetManagers: any;
   defaultIsGrouping: boolean;
   defaultMaxFractionDigits: number;
   defaultMinFractionDigits: number;
   defaultRoundingMode: any;
   defaultSimpleDateFormat: any;
   name: any;
   exportTarget: any;
   fileFormat: any;
   sendMode: any;
   fileSetting: {};
   exportFields: exportField[];
}

export interface fileSetting {
   "@type": "CSV_FILE";
   exportFileName: any;
   includeHeader: boolean;
   staticHeader: any;
   csvDelimiter: any;
}

export const initialFileSetting: fileSetting = {
   "@type": "CSV_FILE",
   exportFileName: "",
   includeHeader: true,
   staticHeader: "",
   csvDelimiter: ",",
};

export const initialExportConfiguration: exportConfiguration = {
   id: 0,
   customerId: 0,
   assetManagers: null,
   defaultIsGrouping: false,
   defaultMaxFractionDigits: 10,
   defaultMinFractionDigits: 0,
   defaultRoundingMode: "DOWN",
   defaultSimpleDateFormat: "yyyy-MM-dd",
   name: "",
   exportTarget: "SFTP",
   fileFormat: "CSV_FILE",
   sendMode: "ONE_BY_ONE",
   fileSetting: initialFileSetting,
   exportFields: [initialExportField],
};
