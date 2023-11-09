import { UserUtils } from "./authenticationUtils";

export function convertArrival(
   arrivalPriceDateTime: any,
   arrivalTimeZone: any
) {
return "";
}

export function transactionObjectConverter(
   transactionObject: any,
   action: string,
   type: string
) {

   const transactionBackend = {
      dataMap: {  Action: action   },
      customerId: UserUtils.getUser()?.customerId,
   };

   return transactionBackend;
}