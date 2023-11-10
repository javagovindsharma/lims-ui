/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-fallthrough */
import { serverErrorMessage, fileErrorMessage } from "../../helpers/constants";
export function commonError(statuscode: number, pageName: string) {
  var errorMsg = "";
  switch (pageName) {
    case "BOND":
      errorMsg = fileErrorMessage.errorBOND;
      break;
    case "BONDMANUALTRANS":
      errorMsg = fileErrorMessage.errorBONDMANUAL;
      break;
    case "BONDS":
      errorMsg = fileErrorMessage.errorBONDSERVICE;
      break;
    case "EQUITY":
      errorMsg = fileErrorMessage.errorEQUITY;
      break;
    case "CFD":
      errorMsg = fileErrorMessage.errorCFD;
      break;
    case "FUTURE":
      errorMsg = fileErrorMessage.errorFUTURE;
      break;
    case "FX":
      errorMsg = fileErrorMessage.errorFX;
      break;
    case "OPTION":
      errorMsg = fileErrorMessage.errorOPTION;
      break;
    case "SERVICEWORK":
      errorMsg = fileErrorMessage.errorSERVICEWORK;
      break;
    case "LOGIN":
      errorMsg = fileErrorMessage.errorLOGIN;
      break;
    case "ISLOGIN":
      errorMsg = fileErrorMessage.errorISLOGIN;
      break;
    case "CONFIGURATIONS":
      errorMsg = fileErrorMessage.errorCONFIGURATIONS;
      break;
    case "CONFIGURATIONSERVICE":
      errorMsg = fileErrorMessage.errorCONFIGURATIONSERVICE;
      break;
    case "MAPPINGCONFIGURATION":
      errorMsg = fileErrorMessage.errorMAPPINGCONFIGURATION;
      break;
    case "TRANSACTIONSERVICE":
      errorMsg = fileErrorMessage.errorTRANSACTIONSERVICE;
      break;
    case "TRANSACTIONTABLE":
      errorMsg = fileErrorMessage.errorTRANSACTIONTABLE;
      break;
    case "UPLOADS":
      errorMsg = fileErrorMessage.errorUPLOADSERVICE;
      break;
    case "PORTFOLIS":
      errorMsg = fileErrorMessage.errorPORTFOLIOSERVICE;
      break;
    case "PORTFOLIOP":
      errorMsg = fileErrorMessage.errorPORTFOLIOPAGE;
      break;
    case "INSTRUMENTTABLE":
      errorMsg = fileErrorMessage.errorINSTRUMENTTABLE;
      break;
    case "INSTRUMENTSTRANS":
      errorMsg = fileErrorMessage.errorINSTRUMENTSTRANS;
      break;
    case "INSTRUMENTSERV":
      errorMsg = fileErrorMessage.errorINSTRUMENTSERVICE;
      break;
    case "CURRENCYCROSS":
      errorMsg = fileErrorMessage.errorCURRENCYCROSS;
      break;
    case "INSTRUMENTFUTURETABLE":
      errorMsg = fileErrorMessage.errorINSTRUMENTFUTURETABLE;
      break;
    case "CURRENCYCROSSSERVICE":
      errorMsg = fileErrorMessage.errorCURRENCYCROSSSERVICE;
      break;
    case "INSTRUMENTBONDTABLE":
      errorMsg = fileErrorMessage.errorINSTRUMENTBONDTABLE;
      break;
    case "COUNTERPARTYTABLE":
      errorMsg = fileErrorMessage.errorCOUNTERPARTYTABLE;
      break;
    case "COUNTERPARTYSERVICE":
      errorMsg = fileErrorMessage.errorCOUNTERPARTYSERVICE;
      break;
    case "REPORTTABLE":
      errorMsg = fileErrorMessage.errorREPORTTABLE;
      break;
    case "REPORTSERVICE":
      errorMsg = fileErrorMessage.errorREPORTSERVICE;
      break;
    case "OPTIONSERVICE":
      errorMsg = fileErrorMessage.errorOPTIONSERVICE;
      break;
    case "OPTIONMANUALTRANS":
      errorMsg = fileErrorMessage.errorOPTIONMANUALTRANS;
      break;
    case "FXMANUALTRANS":
      errorMsg = fileErrorMessage.errorFXMANUALTRANS;
      break;
    case "FUTURESERVICE":
      errorMsg = fileErrorMessage.errorFUTURESERVICE;
      break;
    case "FUTUREMANUALTRANS":
      errorMsg = fileErrorMessage.errorFUTUREMANUALTRANS;
      break;
    case "EQUITYSERVICE":
      errorMsg = fileErrorMessage.errorEQUITYSERVICE;
      break;
    case "EQUITYMANUALTRANS":
      errorMsg = fileErrorMessage.errorEQUITYMANUALTRANS;
      break;
    case "PORTFOLIOSERVICE":
      errorMsg = fileErrorMessage.errorPORTFOLIOSERVICE;
      break;
    case "DEALSERVICE":
      errorMsg = fileErrorMessage.errorDEALSERVICE;
      break;
    case "INSTRUMENTSERVICE":
      errorMsg = fileErrorMessage.errorINSTRUMENTSERVICE;
      break;
    case "COMMONSERVICE":
      errorMsg = fileErrorMessage.errorCOMMONSERVICE;
      break;
    case "CFDMANUALTRANS":
      errorMsg = fileErrorMessage.errorCFDMANUALTRANS;
      break;
    case "CFDSERVICE":
      errorMsg = fileErrorMessage.errorCFDSERVICE;
      break;
    case "REPORTPAGE":
      errorMsg = fileErrorMessage.errorREPORTPAGE;
      break;
    case "HISTORY":
      errorMsg = fileErrorMessage.errorREPORTPAGE;
      break;
    default:
      errorMsg = statuscode.toString();
  }

  errorMsg += "   ";
  switch (statuscode) {
    case 403:
      errorMsg += serverErrorMessage.error403;
      break;
    case 500:
      errorMsg += serverErrorMessage.error500;
      break;
    case 502:
      errorMsg += serverErrorMessage.error502;
      break;
    case 400:
      errorMsg += serverErrorMessage.error400;
      break;
    case 404:
      errorMsg += serverErrorMessage.error404;
      break;
    default:
      errorMsg += statuscode.toString();
  }
  //window.alert(errorMsg);
}
