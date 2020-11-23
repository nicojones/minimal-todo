import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { urls } from 'config/urls';
import { text } from 'config/text';
import { LoggedInUserContext } from 'App';
import cogoToast from 'cogo-toast';

function Login () {

  const history = useHistory();
  const [login, setLogin] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  function onSubmit (e) {
    e.preventDefault();

    authService.login(login).then((responseData) => {
      if (responseData.user) {
        setLogin({});
        setIsLoggedIn(true);
        cogoToast.success(text.login.success, { position: 'bottom-center' });
      } else {
        if (responseData.error.code === 400) {
          cogoToast.error(text.login.error, { position: 'bottom-center' })
        }
        console.info(responseData);
      }
    });
  }

  if (React.useContext(LoggedInUserContext)) {
    history.push(urls.app);
    return null;
  }

  return (
    <>
      {
        isLoggedIn
          ? <Redirect to={ urls.app }/>
          :
          <>
            <div className="row">
              <form onSubmit={ onSubmit } className="flex-center-self center-block">
                <input
                  value={ login.email || '' } onChange={ (e) => setLogin({
                  ...login,
                  email: e.target.value
                }) } placeholder="email" type="email" autoFocus
                />
                <input
                  value={ login.password || '' } onChange={ (e) => setLogin({
                  ...login,
                  password: e.target.value
                }) } placeholder="password" type="password"
                />
                <div className="flex-row">
                  <button type="submit" className="btn btn-block">{ text.login.login }</button>
                  <Link to={ urls.signup } className="btn-flat right">{ text.login.noAccount } { text.login.signup }</Link>
                </div>
              </form>
            </div>
          </>
      }
    </>
  );
}

export default Login;
