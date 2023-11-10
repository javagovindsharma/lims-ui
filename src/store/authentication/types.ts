export enum AuthActionTypes {
  LOGIN = "@auth/LOGIN",
  LOGOUT = "@auth/LOGOUT",
  LOADING = "@auth/LOADING",
  ERROR = "@auth/ERROR_AUTH",
  IDPLOGIN = "@auth/IDP_LOGIN",
  IDPLOGOUT = "@auth/IDP_LOGOUT",
  TIMEZONECHANGE = "@auth/TIMEZONECHANGE",
  LOGIN_FAILURE = "LOGIN_FAILURE"
}

export interface AuthState {
  readonly data: [] | null;
  readonly loading: boolean;
  readonly error: any;
  readonly sessionId: string;
  readonly userSetting: { timeZone: string; allTransactionColumn: [] | null };
}
