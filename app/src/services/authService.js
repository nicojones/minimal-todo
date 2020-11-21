import axios from 'axios';
import environment from './environment';
import { auth } from './firebase';
import { sha1 } from 'functions/sha1';

export const authService = {

  authState: (done) => {
    auth().onAuthStateChanged(done);
  },

  signup: (signupData) => {
    const originalLoginData = {
      password: signupData.password,
      email: signupData.email
    };
    return sha1(signupData.password)
      .then((sha1Password) => {
        signupData.password = sha1Password;
        return sha1(signupData.confirm);
      })
      .then((sha1Confirm) => {
        signupData.confirm = sha1Confirm;

        return axios({
          url: `${ environment.url }/signup`,
          method: 'POST',
          data: signupData
        });
      })
      .then((response) => {
        return authService.login(originalLoginData);
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
  }
};
