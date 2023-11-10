export interface User {
  userDisplayName: string;
  assetManager?: string;
  customerId?: string;
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

export interface MemberOfAssetMgrGroup {
  id: number;
  name: string;
  shortname: string;
  errorEmail: string;
  customer_id: number;
  customer_name: string;
}

export interface iHUBUser {
  email: string;
  firstname: string;
  lastname: string;
  superuserOfCustomers: SuperuserOfCustomer[];
  memberOfAssetMgrGroups: MemberOfAssetMgrGroup[];
}

export const initialiHUBUser: iHUBUser = {
  email: "",
  firstname: "",
  lastname: "",
  superuserOfCustomers: [],
  memberOfAssetMgrGroups: [],
};

export const initialUser: User = {
  userDisplayName: "",
  assetManager: "",
  customerId: "",
  emailId: "",
};
