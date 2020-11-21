import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDxmJzv3ccl0_ouKB9oVSzWIsn6uysYMLQ",
  databaseURL: "https://todo-list-react-33431.firebaseio.com",
  projectId: "todo-list-react-33431",
};
firebase.initializeApp(firebaseConfig);

export const analytics = firebase.analytics;
export const auth = firebase.auth;
export const db = firebase.firestore;
