import axios from 'axios';
import { environment } from './environment';
import { auth } from './firebase';
import { text } from 'config/text';
import { showToast } from './toast';
import { ISignupForm, ISignupFormError } from '../interfaces/signup-form.interface';
import { ILoginForm, IUser, PDefault } from '../interfaces';
import firebase from 'firebase/app';


const sha1 = require('sha1');

let debounceAuth: any;

export const authService = {

  setToken: (token: string) => {
    localStorage.setItem('AuthToken', token);
  },

  authState: (done: (user: IUser) => any) => {
    auth().onIdTokenChanged((user) => {
      // auth().onAuthStateChanged((user) => {
      clearTimeout(debounceAuth);
      debounceAuth = setTimeout(() => {
        user && user.getIdToken(true).then((token: string) => {
          authService.setToken(token);
        });

        done(user as IUser);
      }, 300);
    });
  },

  signup: (signupData: ISignupForm) => {
    return axios({
      url: `${ environment.url }/signup`,
      method: 'POST',
      data: {
        ...signupData,
        password: sha1(signupData.password)
      }
    })
      .then((response) => {
        return authService.login({
          email: signupData.email,
          password: signupData.password
        });
      });
  },

  login: (loginData: ILoginForm) => {
    let userCredential: firebase.auth.UserCredential;

    return auth()
      .signInWithEmailAndPassword(loginData.email, sha1(loginData.password))
      .then((response: firebase.auth.UserCredential) => {
        // @ts-ignore
        localStorage.setItem('uid', JSON.stringify(response.user.uid));
        userCredential = response;
        // @ts-ignore
        return auth().currentUser.getIdToken();
      })
      .then((authToken) => {
        authService.setToken(authToken);
        return userCredential;
      });
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
