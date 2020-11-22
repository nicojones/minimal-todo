import React, { useContext } from 'react';
import Footer from './Footer';
import { LoggedInUserContext } from 'App';
import { auth } from 'services/firebase';
import { text } from '../../text';

function HomePage ({ loaded }) {

  const user = useContext(LoggedInUserContext);

  function signOut (e) {
    e.preventDefault();

    auth().signOut().then(() => {
      console.log('You\'ve been signed out of the app');
    })
  }

  return (
    <>

      <nav>
        <div className="nav-wrapper container">
          <a href="/app" className="brand-logo">Todo List</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {
              user
                ? loaded && <>
                  <li><a href="/app">{ text.gotoApp }</a></li>
                  <li><a href="#!" onClick={ signOut } className="btn-invisible">{ text.login.logout }</a></li>
                </>
                : loaded && <>
                  <li><a href="/login">{ text.login.login }</a></li>
                  <li><a href="/signup">{ text.login.signup }</a></li>
                </>
            }
          </ul>
        </div>
      </nav>
      <div
        style={ {
          height: '300px',
          display: 'block'
        } }
      >
        <h4 className="flex-center-self center-align">Welcome to the best todo-app</h4>
      </div>
      <Footer/>
    </>
  );
}

export default HomePage;
