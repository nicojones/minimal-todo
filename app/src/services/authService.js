import axios from 'axios';
import environment from './environment';
import { auth } from './firebase';
import { sha1 } from 'functions/sha1';

let debounceAuth;

export const authService = {

  authState: (done) => {
    auth().onAuthStateChanged((user) => {
      clearTimeout(debounceAuth);
      debounceAuth = setTimeout(() => {
        done(user);
      }, 200);
    });
  },

  signup: (signupData) => {
    return sha1(signupData.password)
      .then((sha1Password) => {
        return axios({
          url: `${ environment.url }/signup`,
          method: 'POST',
          data: { ...signupData, password: sha1Password }
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
        localStorage.setItem('AuthToken', authToken);
        return userCredential;
      });
  },

  logout: (e) => {
    e.preventDefault();

    auth().signOut().then(() => {
      console.info('You\'ve been signed out of the app');
    });
  },

  validateSignup: (signupData) => {
    console.log('data?', signupData)
    if (!signupData.username) {
      return 'Must enter a valid username';
    }
    if (!signupData.name || signupData.name.length <= 5) {
      return 'Must enter a valid name';
    }
    if (!signupData.email || signupData.email.length <= 5) {
      return 'Invalid email';
    }
    if (!signupData.password || !signupData.confirm) {
      return 'Password can\'t be empty';
    }
    if (signupData.password !== signupData.confirm) {
      return 'Passwords don\'t match';
    }
  }
};
