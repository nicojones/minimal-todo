import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDxmJzv3ccl0_ouKB9oVSzWIsn6uysYMLQ",
  authDomain: "todo-list-react-33431.firebaseapp.com",
  databaseURL: "https://todo-list-react-33431.firebaseio.com",
  projectId: "todo-list-react-33431",
  storageBucket: "todo-list-react-33431.appspot.com",
  messagingSenderId: "153291173882",
  appId: "1:153291173882:web:4eb5673b9a70ce5828fe43",
  measurementId: "G-BCMCPMQHDB"
};
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.database();
