import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import environment from './environment';


firebase.initializeApp(environment);

export const analytics = firebase.analytics;
export const auth = firebase.auth;
export const db = firebase.firestore;

if (!environment.production) {
  db().useEmulator('localhost', 8080);
  auth().useEmulator('http://localhost:9099/');
}
