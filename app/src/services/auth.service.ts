import { AxiosResponse } from "axios";
import { text } from "config/text";
import jwt_decode from "jwt-decode";
import { constants, urls } from "../config";
import { ILoginForm, IUser, LoginResponse, LoginUser } from "../interfaces";
import {
  ISignupForm,
  ISignupFormError,
} from "../interfaces/signup-form.interface";
import { minimalAxios } from "./axios.service";
import { showToast } from "./toast";
import { Observable, map, tap } from "rxjs";

export class AuthService {
  public static currentUser = (): LoginUser | null => {
    const token: string | null = localStorage.getItem(
      constants.storageKey.AUTH_TOKEN
    );
    if (token) {
      return jwt_decode<LoginUser>(token);
    }
    return null;
  };

  public static setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(constants.storageKey.AUTH_TOKEN, "Bearer " + token);
    } else {
      localStorage.removeItem(constants.storageKey.AUTH_TOKEN);
    }
  };

  public static handleError = (
    e: { response?: { status: number } },
    error: string = "ERROR"
  ) => {
    const status: number = e.response?.status || 0;

    showToast("error", error);

    if ([401, 403].includes(status)) {
      AuthService.logout(urls.login);
    }
  };

  public static signup = (signupData: ISignupForm): Observable<LoginUser> => {
    return minimalAxios<LoginResponse, ISignupForm>(
      "POST",
      "/api/auth/signup",
      {
        body: {
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
        },
      }
    ).pipe(
      map((response: LoginResponse) => {
        AuthService.setToken(response.token);
        return AuthService.currentUser() as LoginUser;
      })
    );
  };

  public static login = (loginData: ILoginForm): Observable<LoginUser> => {
    return minimalAxios<LoginResponse, ILoginForm>("POST", "/api/auth", {
      body: {
        email: loginData.email,
        password: loginData.password,
      },
    }).pipe(
      map((response: LoginResponse) => {
        AuthService.setToken(response.token);
        return AuthService.currentUser() as LoginUser;
      })
    );
  };

  public static loginCatch = (status: number) => {
    if (status === 403) {
      showToast("error", text.login.invalidPass);
    } else if (status === 404) {
      showToast("error", text.login.invalidUser);
    } else {
      showToast("error", text.login.internalError);
    }
  };

  public static logout = (url: string = urls.home) => {
    AuthService.setToken(null);
    window.location.href = url;
  };

  public static validateSignup = (
    signupData: ISignupForm
  ): ISignupFormError => {
    // if (!signupData.username) {
    //   return { username: 'Must enter a valid username' };
    // }
    if (!signupData.name || signupData.name.length <= 2) {
      return { name: "Must enter a longer name" };
    }
    if (!signupData.email || signupData.email.length <= 5) {
      return { email: "Invalid email" };
    }
    if (!signupData.password) {
      return { password: "Password can't be empty" };
    }
    return {};
  };
}
