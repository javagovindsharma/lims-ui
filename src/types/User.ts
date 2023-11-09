export interface AssetManager {
  id?: any;
  shortName: any;
  name: any;
  errorEmail: any;
  action?: any;
  customerId?: any;
}

export let initialAssetManager: AssetManager = {
  shortName: "",
  name: "",
  errorEmail: "",
};

export let initialNewAssetManager: AssetManager = {
  shortName: "",
  name: "",
  errorEmail: "",
};

export interface User {
  email: any;
  firstname: any;
  lastname: any;
  assetMgr: any;
  customerId: any;
  isSuperUser: any;
  action: any;
}

export let initialUser: User = {
  email: "",
  firstname: "",
  lastname: "",
  assetMgr: "",
  customerId: "",
  isSuperUser: "No",
  action: "",
};

export let newUserInitial: User = {
  email: "",
  firstname: "",
  lastname: "",
  assetMgr: "",
  customerId: "",
  isSuperUser: "No",
  action: "",
};
export interface assetManager {
  customerId: any;
  shortname: any;
}

export const initialAssetMgr: assetManager = {
  customerId: "",
  shortname: "",
};

export interface UserReponse {
  action: any;
  email: any;
  status: any;
}

export const initialUserResponse: UserReponse = {
  action: "ADD",
  email: "",
  status: "OKs",
};
