import { AxiosResponse } from 'axios';
import { text } from 'config/text';
import jwt_decode from "jwt-decode";
import { constants, urls } from "../config";
import { ILoginForm, IUser, LoginResponse, LoginUser } from '../interfaces';
import { ISignupForm, ISignupFormError } from '../interfaces/signup-form.interface';
import { minimalAxios } from './axios.service';
import { showToast } from './toast';


export class AuthService {

  public static currentUser = (): LoginUser | null => {
    const token: string | null = localStorage.getItem(constants.storageKey.AUTH_TOKEN);
      if (token) {
        return jwt_decode<LoginUser>(token);
      }
      return null;
  }

  public static setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(constants.storageKey.AUTH_TOKEN, "Bearer " + token);
      minimalAxios.defaults.headers.common.Authorization = "Bearer " + token;
    } else {
      localStorage.removeItem(constants.storageKey.AUTH_TOKEN);
      delete minimalAxios.defaults.headers.common.Authorization;
    }
  }

  public static handleError = (e: { response?: { status: number}}, error: string = "ERROR") => {
    (window as any).PB_ERROR = error;

    const status: number = e.response?.status || 0;

    showToast('error', error);
    console.log("there's an error", status);

    if ([401, 403].includes(status)) {
      AuthService.logout(urls.login);
    }
  }

  public static signup = (signupData: ISignupForm): Promise<LoginUser> => {
    return minimalAxios.post(
      "/api/auth/signup",
      {
        email: signupData.email,
        password: signupData.password,
        name: signupData.name
      })
      .then((response: AxiosResponse<LoginResponse>) => {
        AuthService.setToken(response.data.token);
        return AuthService.currentUser() as LoginUser;
      })
  }

  public static login = (loginData: ILoginForm): Promise<LoginUser> => {
    return minimalAxios.post(
      "/api/auth",
      {
        email: loginData.email,
        password: loginData.password,
      })
      .then((response: AxiosResponse<LoginResponse>) => {
        AuthService.setToken(response.data.token);
        return jwt_decode<LoginUser>(response.data.token);
      })
  }

  public static loginCatch = (status: number) => {
    if (status === 403) {
      showToast('error', text.login.invalidPass);
    } else if (status === 404) {
      showToast('error', text.login.invalidUser);
    } else {
      showToast('error', text.login.internalError);
    }
  }

  public static logout = (url: string = urls.home) => {

    // AuthService.setToken(null);
    // window.location.href = url;

    showToast('success', 'You\'ve been signed out of the app');

  }

  public static validateSignup = (signupData: ISignupForm): ISignupFormError => {
    // if (!signupData.username) {
    //   return { username: 'Must enter a valid username' };
    // }
    if (!signupData.name || signupData.name.length <= 2) {
      return { name: 'Must enter a longer name' };
    }
    if (!signupData.email || signupData.email.length <= 5) {
      return { email: 'Invalid email' };
    }
    if (!signupData.password) {
      return { password: 'Password can\'t be empty' };
    }
    return {};
  }
};
