export interface CustomRouteInstance {
  key: string;
  label: string;
  path: string;
  dynamicPath?: boolean;
}

export interface CustomRoute {
  [key: string]: CustomRouteInstance;
}

export const CustomRoutes: CustomRoute = {
  DEFAULT: { key: "DEFAULT", label: "Home", path: "/" },
  UPLOAD: { key: "Upload", label: "Upload", path: "/upload" },
  BONDS: { key: "BOND", label: "Bond", path: "/bonds" },
  NEWBOND: { key: "NEWBOND", label: "New Bond", path: "/bonds/new" },
  USERS: { key: "USERS", label: "Users", path: "/admin/users" },
  STATIC: { key: "STATIC", label: "Static Data", path: "/admin/static" },
  LOGS: { key: "LOGS", label: "Logs", path: "/admin/logs" },
  SDR: { key: "SDR", label: "SDR", path: "/admin/sdr" },
  HISTORY: { key: "HISTORY", label: "History", path: "/history" },
  TRADE_CAPTURE: {
    key: "TRADECPTURE",
    label: "Trade Capture",
    path: "/tradeCapture",
  },
  TRANSACTIONS: {
    key: "TRANSACTIONS",
    label: "All Transactions",
    path: "/alltxns",
  },
  EQUITY: { key: "EQUITY", label: "Equity", path: "/equity" },
  NEW_EQUITY: {
    key: "NEW_EQUITY",
    label: "NewEquity",
    path: "/equity/newEquity",
  },
  CFD: { key: "CFD", label: "CFD", path: "/cfd" },
  PROFILE: { key: "PROFILE", label: "Profile", path: "/profile" },
  FUTURE: { key: "FUTURE", label: "Future", path: "/future" },
  FX: { key: "FX", label: "FX", path: "/fx" },
  OPTION: { key: "OPTION", label: "Option", path: "/option" },
  SSO: { key: "SSO", label: "SSO", path: "/sso" },
  SSO_SUCCESS: {
    key: "SSO_SUCCESS",
    label: "SSOSuccess",
    path: "/sso/ssosuccess",
  },
  SSO_ERROR: {
    key: "SSO_ERROR",
    label: "SSOError",
    path: "/sso/ssoerror",
  },
  SSO_LOGOUT: {
    key: "SSO_LOGOUT",
    label: "SSOLogout",
    path: "/sso/ssologout",
  },
  ADMIN: { key: "ADMIN", label: "Admin", path: "/admin" },
  CONFIGURATION: {
    key: "CONFIGURATION",
    label: "Configurations",
    path: "/admin/importconfiguration",
  },
  REPORTS_PAGE: {
    key: "REPORTS",
    label: "Reports",
    path: "/reports",
  },
  IRS: {
    key: "IRS",
    label: "IRS",
    path: "/irs",
  },
  CDS: {
    key: "CDS",
    label: "CDS",
    path: "/CDS",
  },
  TRS: {
    key: "TRS",
    label: "TRS",
    path: "/trs",
  },
  DEPOSIT: {
    key: "DEPOSIT",
    label: "Deposit",
    path: "/deposit",
  },
  REPOS: {
    key: "REPOS",
    label: "Repos",
    path: "/repos",
  },
  EXPORT_CONFIG: {
    key: "ExportConfig",
    label: "Export Configuration",
    path: "/admin/exportconfiguration",
  },
};
