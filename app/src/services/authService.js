import axios from 'axios';
import environment from './environment';
import cogoToast from 'cogo-toast';
import { auth } from './firebase';
import { sha1 } from 'functions/sha1';
import { text } from 'config/text';
import { constants } from 'config/constants';

let debounceAuth;

export const authService = {

  setToken: (token) => {
    localStorage.setItem('AuthToken', token);
  },

  authState: (done) => {
    auth().onIdTokenChanged((user) => {
      clearTimeout(debounceAuth);
      debounceAuth = setTimeout(() => {
        user && user.getIdToken(true).then((token) => {
          authService.setToken(token);
        });

        done(user);
      }, 300);
    });
  },

  signup: (signupData) => {
    return sha1(signupData.password)
      .then((sha1Password) => {
        return axios({
          url: `${ environment.url }/signup`,
          method: 'POST',
          data: {
            ...signupData,
            password: sha1Password
          }
        });
      })
      .then((response) => {
        return authService.login({
          email: signupData.email,
          password: signupData.password
        });
      });
  },

  login: (loginData) => {
    let userCredential;

    return sha1(loginData.password)
      .then((sha1Password) => {
        return auth().signInWithEmailAndPassword(loginData.email, sha1Password);
      })
      .then((response) => {
        localStorage.setItem('uid', JSON.stringify(response.user.uid));
        userCredential = response;
        return auth().currentUser.getIdToken();
      })
      .then((authToken) => {
        authService.setToken(authToken);
        return userCredential;
      });
  },

  loginCatch: (reason) => {
    console.error(reason, reason.code, reason.code === 'auth/user-not-found');
    if (reason.code === 'auth/wrong-password') {
      cogoToast.error(text.login.invalidPass, constants.toast);
    } else if (reason.code === 'auth/user-not-found') {
      cogoToast.error(text.login.invalidUser, constants.toast);
    } else {
      cogoToast.error(reason.message, constants.toast);
    }
  },

  logout: (e) => {
    e.preventDefault();

    auth().signOut().then(() => {
      cogoToast.success('You\'ve been signed out of the app', { position: 'bottom-center' });
    });
  },

  validateSignup: (signupData) => {
    if (!signupData.username) {
      return { username: 'Must enter a valid username' };
    }
    if (!signupData.name || signupData.name.length <= 2) {
      return { name: 'Must enter a longer name' };
    }
    if (!signupData.email || signupData.email.length <= 5) {
      return { email: 'Invalid email' };
    }
    if (!signupData.password || !signupData.confirm) {
      return { password: 'Password can\'t be empty' };
    }
    if (signupData.password !== signupData.confirm) {
      return { password: 'Passwords don\'t match' };
    }
    return {};
  }
};
