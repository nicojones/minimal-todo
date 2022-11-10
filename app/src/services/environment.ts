export const environment = {
  production: true,
  pocketbase: "http://kupfer.es:8090",
  firebase: {
    apiKey: 'AIzaSyDxmJzv3ccl0_ouKB9oVSzWIsn6uysYMLQ',
    databaseURL: 'https://todo-list-react-33431.firebaseio.com',
    projectId: 'todo-list-react-33431',
    authDomain: 'todo-list-react-33431.firebaseapp.com',
    storageBucket: 'todo-list-react-33431.appspot.com',
    messagingSenderId: '153291173882',
    appId: '1:153291173882:web:4eb5673b9a70ce5828fe43',
    measurementId: 'G-BCMCPMQHDB'
  },

  url: 'https://us-central1-todo-list-react-33431.cloudfunctions.net/api'
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  environment.production = false;
  environment.url = 'http://localhost:5000/todo-list-react-33431/us-central1/api';
  environment.firebase.databaseURL = 'http://localhost:8080';
  console.info('RUNNING ON DEVELOPMENT MODE', environment.url, environment.firebase.databaseURL);
} else {
  // production code
}
