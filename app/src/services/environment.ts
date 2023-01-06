export const environment = {
  production: true,

  // url: 'https://us-central1-todo-list-react-33431.cloudfunctions.net/api'
  url: 'http://localhost:8080'
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  environment.production = false;
  environment.url = 'http://localhost:8080';
} else {
  // production code
}
