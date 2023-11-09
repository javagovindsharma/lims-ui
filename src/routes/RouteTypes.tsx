export interface CustomRoutesInstance {
  key: string;
  label: string;
  path: string;
  dynamicPath?: boolean;
}

export interface CustomRoute {
    [key: string]: CustomRoutesInstance;
}

export const CustomRoutes: CustomRoute = {
    DEFAULT: {key:"DEFAULT",label:"Home",path:"/" },
    LOGIN: {key:"LOGIN",label:"Login",path:"/login" },
    EMPLOPYE: {key:"EMPLOPYE",label:"Employe Master",path:"/employe" },
    ERROR: {key:"ERROR",label:"Error",path:"/error" }
};