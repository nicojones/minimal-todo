const environment = {
  production: true,

  firebase: {
    apiKey: 'AIzaSyDxmJzv3ccl0_ouKB9oVSzWIsn6uysYMLQ',
    databaseURL: "https://todo-list-react-33431.firebaseio.com",
    projectId: 'todo-list-react-33431',
    authDomain: "todo-list-react-33431.firebaseapp.com",
    storageBucket: "todo-list-react-33431.appspot.com",
    messagingSenderId: "153291173882",
    appId: "1:153291173882:web:4eb5673b9a70ce5828fe43",
    measurementId: "G-BCMCPMQHDB"
  },

  url: 'https://us-central1-todo-list-react-33431.cloudfunctions.net/api',
};

environment.production = false; environment.url = 'http://localhost:5000/todo-list-react-33431/us-central1/api';

export default environment;
