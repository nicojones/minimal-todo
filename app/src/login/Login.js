import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { urls } from 'config/urls';
import { text } from 'config/text';
import { LoggedInUserContext } from 'App';
import cogoToast from 'cogo-toast';
import LoginBox from './LoginBox';
import { defaultToast } from '../config/defaultToast';

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
          cogoToast.success(text.login.success, defaultToast);
        } else {
          if (responseData.error.code === 400) {
            cogoToast.error(text.login.error, defaultToast);
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
            <LoginBox title={ text.login.login } loading={ loading }>
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
