export interface User {
  userDisplayName: string;
  emailId?: string;
  isSuperUser?: boolean;
}

export interface Relation {
  AssetManager: string;
  isSuperUser: string;
  CustomerId: string;
  CustomerName: string;
}

export interface Relations {
  Relations: Relation[];
}

export interface SuperuserOfCustomer {
  id: number;
  name: string;
  shortname: string;
  integration: string;
}

export const initialUser: User = {
  userDisplayName: "",
  emailId: "",
   isSuperUser: false
};
 