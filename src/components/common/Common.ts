import { CustomRoutes } from "../../router/RouteTypes";

export const menuListItems = [
  // {
  //   linkPath: CustomRoutes.TRADE_CAPTURE.path,
  //   icon: "fas fa-tasks",
  //   dataId: "main-trade",
  //   text: CustomRoutes.TRADE_CAPTURE.label,
  // },
  {
    linkPath: CustomRoutes.DEFAULT.path,
    icon: "fas fa-home",
    dataId: "main-home",
    text: CustomRoutes.DEFAULT.label,
  },
  {
    linkPath: "/reports",
    icon: "fas fa-file-alt",
    dataId: "main-report",
    text: "Reports",
  },
] as menuListItemTypes[];

export const superUserMenuListItems = [
  // {
  //   linkPath: CustomRoutes.TRADE_CAPTURE.path,
  //   icon: "fas fa-tasks",
  //   dataId: "main-trade",
  //   text: CustomRoutes.TRADE_CAPTURE.label,
  // },
  {
    linkPath: CustomRoutes.DEFAULT.path,
    icon: "fas fa-home",
    dataId: "main-home",
    text: CustomRoutes.DEFAULT.label,
  },
  {
    linkPath: CustomRoutes.CONFIGURATION.path,
    icon: "fas fa-tools",
    dataId: "main-bonds",
    text: CustomRoutes.ADMIN.label,
  },
  {
    linkPath: "/reports",
    icon: "fas fa-file-alt",
    dataId: "main-report",
    text: "Reports",
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
    linkPath: CustomRoutes.CONFIGURATION.path,
    icon: "fas fa-tools",
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
