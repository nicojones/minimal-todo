import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from './environment';


firebase.initializeApp(environment.firebase);

export const auth = firebase.auth;
export const db = firebase.firestore;

// if (!environment.production) {
//   // IS DEV
//   db().useEmulator('localhost', 8080);
//   auth().useEmulator('http://localhost:9099/');
// }
