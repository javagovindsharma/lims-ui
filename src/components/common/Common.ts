import { CustomRoutes } from "../../router/RouteTypes";

export const menuListItems = [
  {
    linkPath: CustomRoutes.DEFAULT.path,
    icon: "fas fa-home",
    dataId: "main-home",
    text: CustomRoutes.DEFAULT.label,
  }
] as menuListItemTypes[];

export const superUserMenuListItems = [
   {
      linkPath: CustomRoutes.DEFAULT.path,
      icon: "fas fa-home",
      dataId: "main-home",
      text: CustomRoutes.DEFAULT.label,
   },
   {
      linkPath: CustomRoutes.EMPLOYEE.path,
      icon: "fas fa-users",
      dataId: "main-bonds",
      text: CustomRoutes.EMPLOYEE.label,
   },
] as menuListItemTypes[];

export const adminMenuListItems = [
   {
      linkPath: CustomRoutes.DEFAULT.path,
      icon: "fas fa-home",
      dataId: "main-home",
      text: CustomRoutes.DEFAULT.label,
   },
   {
      linkPath: CustomRoutes.EMPLOYEE.path,
      icon: "fas fa-users",
      dataId: "main-bonds",
      text: CustomRoutes.ADMIN.label,
   },
] as menuListItemTypes[];

export interface menuListItemTypes {
  linkPath: string;
  icon: string;
  dataId: string;
  text: string;
}
