import {auth, pbClient} from './firebase';
import {text} from 'config/text';
import {showToast} from './toast';
import {ISignupForm, ISignupFormError} from '../interfaces/signup-form.interface';
import {ILoginForm, LoginResponse, PbUser, PDefault} from '../interfaces';
import {constants, urls} from "../config";
import {PbError} from "../interfaces/pb-error.interface";


const sha1 = require('sha1');

let debounceAuth: any;

export const authService = {

  setToken: (token: string) => {
    localStorage.setItem(constants.storageKey.AUTH_TOKEN, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(constants.storageKey.AUTH_TOKEN);
  },

  setUser: (user: PbUser) => {
    localStorage.setItem(constants.storageKey.PB_USER, JSON.stringify(user || null));
  },

  getUser: (): PbUser | null => {
    const userString: string | null = localStorage.getItem(constants.storageKey.PB_USER);
    if (userString) {
      return JSON.parse(userString)
    }
    return null;
  },

  handleError: (label: string, error: PbError) => {
    (window as any).PB_ERROR = error;

    showToast('error', label + ' -- ' + error.message)

    if ([401, 403].includes(error.code)) {
      localStorage.removeItem(constants.storageKey.AUTH_TOKEN);
      localStorage.removeItem(constants.storageKey.PB_USER);
      window.location.hash = urls.login;
    }
  },

  authState: (done: (user: PbUser | null) => any) => {
    done(authService.getUser());
  },

  signup: (signupData: ISignupForm): Promise<PbUser> => {
    let user: PbUser;
    return (pbClient.users.create({
      email: signupData.email,
      password: signupData.password,
      passwordConfirm: signupData.password,
    }) as Promise<unknown> as Promise<PbUser>)
      .then(() => {
        return authService.login({email: signupData.email, password: signupData.password})
      })
      .then((response: LoginResponse) => {
        user = response.user;
        return pbClient.records.update('profiles', response.user.profile.id, {
          name: signupData.name,
        });
      })
      .then((a) => {
        return pbClient.users.requestVerification(signupData.email)
      })
      .then(() => user)
  },

  login: (loginData: ILoginForm): Promise<LoginResponse> => {
    return (pbClient.users
      .authViaEmail(loginData.email, loginData.password) as Promise<unknown> as Promise<LoginResponse>)
      .then((response: LoginResponse) => {
        authService.setToken(response.token);
        authService.setUser(response.user);
        return response;
      })
  },

  loginCatch: (reason: { code: string; message: string }) => {
    console.error(reason, reason.code, reason.code === 'auth/user-not-found');
    if (reason.code === 'auth/wrong-password') {
      showToast('error', text.login.invalidPass);
    } else if (reason.code === 'auth/user-not-found') {
      showToast('error', text.login.invalidUser);
    } else {
      showToast('error', reason.message);
    }
  },

  logout: (e: PDefault) => {
    e.preventDefault();

    return auth().signOut().then(() => {
      showToast('success', 'You\'ve been signed out of the app');
    });
  },

  validateSignup: (signupData: ISignupForm): ISignupFormError => {
    // if (!signupData.username) {
    //   return { username: 'Must enter a valid username' };
    // }
    if (!signupData.name || signupData.name.length <= 2) {
      return {name: 'Must enter a longer name'};
    }
    if (!signupData.email || signupData.email.length <= 5) {
      return {email: 'Invalid email'};
    }
    if (!signupData.password) {
      return {password: 'Password can\'t be empty'};
    }
    return {};
  }
};
