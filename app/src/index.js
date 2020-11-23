import React  from 'react';
import ReactDOM from 'react-dom';
import 'sass/index.scss';
import 'assets/loader.svg';
import 'functions/screenSize'; // must be imported here.

// import 'materialize-css/dist/js/materialize.min.js';
import App from 'App';

// ======================================== //

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
