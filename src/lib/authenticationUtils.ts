import { User } from "../types/Iuser";

class AuthStorage {
  private static storageToUse = localStorage; //using session storage for now, may need to be changed

  protected static setItem(key: string, value: string) {
    AuthStorage.storageToUse.setItem(key, value);
  }

  protected static getItem(key: string) {
    return AuthStorage.storageToUse.getItem(key);
  }

  protected static removeItem(key: string) {
    AuthStorage.storageToUse.removeItem(key);
  }
}

export class TokenUtils extends AuthStorage {
  private static tokenAccessKey: string = "token";

  /**
   * Stores the passed in JWT in storage
   * @param token JWT token to store for later use
   */
  static setToken(token: string) {
    AuthStorage.setItem(TokenUtils.tokenAccessKey, token);
  }

  /**
   * Returns the token from storage
   */
  static getToken() {
    return AuthStorage.getItem(TokenUtils.tokenAccessKey);
  }

  static removeToken() {
    AuthStorage.removeItem(TokenUtils.tokenAccessKey);
  }
}

export class UserUtils extends AuthStorage {
  private static userAccessKey: string = "user";

  static setUser(user: User) {
    AuthStorage.setItem(UserUtils.userAccessKey, JSON.stringify(user));
  }

  static getUser() {
    const userJson = AuthStorage.getItem(UserUtils.userAccessKey);
    let userObject: User | undefined = undefined;
    if (userJson) {
      userObject = JSON.parse(userJson ?? "");
    }
    return userObject;
  }

  static removeUser() {
    AuthStorage.removeItem(UserUtils.userAccessKey);
  }
}

export class SSOUtils extends AuthStorage {
  private static SSOErrorAccessKey: string = "sso_error";
  private static SSOSuccessAccessKey: string = "sso_success_email";

  static removeSsoError() {
    AuthStorage.removeItem(SSOUtils.SSOErrorAccessKey);
  }
  //getter setters copied from above for sso_success case // Deepansh

  static removeSsoSuccess() {
    AuthStorage.removeItem(SSOUtils.SSOSuccessAccessKey);
  }
}

export class AuthUtils {
  static setAuthData(token: string, user: User | null) {
    TokenUtils.setToken(token); //maybe do some checks before?
    if (user) {
      UserUtils.setUser(user);
    }
  }

  static clearAuthData() {
    TokenUtils.removeToken();
    UserUtils.removeUser();
  }
}
