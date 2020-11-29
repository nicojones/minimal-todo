import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { urls } from 'config/urls';
import { text } from 'config/text';
import { LoggedInUserContext } from 'App';
import LoginBox from './LoginBox';
import { showToast } from 'services/toast';

function Login () {

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  function onSubmit (e) {
    e.preventDefault();

    setLoading(true);

    authService
      .login(login)
      .then((responseData /* Returns {user, error}! */) => {

        setLoading(false);

        if (responseData.user) {
          // setLogin({});
          setIsLoggedIn(true);
          showToast('success', text.login.success);
        } else {
          if (responseData.error.code === 400) {
            showToast('error', text.login.error);
          }
          console.info(responseData);
        }
      })
      .catch((reason) => {
        setLoading(false);
        authService.loginCatch(reason);
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
            <LoginBox data-tip={ text.login.login } loading={ loading }>
              <form onSubmit={ onSubmit } className="flex-center-self">
                <input
                  value={ login.email || '' } onChange={ (e) => setLogin({
                  ...login,
                  email: e.target.value
                }) } placeholder="email" type="email" autoFocus required
                />
                <input
                  value={ login.password || '' } onChange={ (e) => setLogin({
                  ...login,
                  password: e.target.value
                }) } placeholder="password" type="password" autoComplete="off" required
                />
                <div className="flex-row">
                  <button type="submit" className="btn btn-block">{ text.login.login }</button>
                  <Link
                    to={ urls.signup } className="btn-flat right"
                  >{ text.login.noAccount } { text.login.signup }</Link>
                </div>
              </form>
            </LoginBox>
          </>
      }
    </>
  );
}

export default Login;
