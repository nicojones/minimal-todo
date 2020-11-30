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
  const [loginFormData, setLoginFormData] = useState({});
  const [loggingIn, setLoggingIn] = useState(false);

  // If the user is logged in already, redirect to the app!
  if (React.useContext(LoggedInUserContext)) {
    history.push(urls.app);
    return null;
  }

  function onSubmit (e) {
    e.preventDefault();

    setLoading(true);

    authService
      .login(loginFormData)
      .then((responseData /* Returns {user, error}! */) => {

        setLoading(false);

        if (responseData.user) {
          setLoginFormData({});
          setLoggingIn(true);
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

  return (
    <>
      {
        loggingIn
          ? <Redirect to={ urls.app }/>
          :
          <>
            <LoginBox data-tip={ text.login.login } loading={ loading }>
              <form onSubmit={ onSubmit } className="flex-center-self">
                <div className="form-group">
                  <label>{ text.login.f.email._ }</label>
                  <input
                    value={ loginFormData.email || '' } onChange={ (e) => setLoginFormData({
                    ...loginFormData,
                    email: e.target.value
                  }) } placeholder={ text.login.f.email.ph } type="email" autoFocus required
                  />
                </div>
                <div className="form-group">
                  <label>{ text.login.f.password._ }</label>
                  <input
                    value={ loginFormData.password || '' } onChange={ (e) => setLoginFormData({
                    ...loginFormData,
                    password: e.target.value
                  }) } placeholder={ text.login.f.password.ph } type="password" autoComplete="off" required
                  />
                </div>
                <br/>
                <div className="flex-column">
                  <button type="submit" className="btn btn-block btn-invisible">{ text.login.login }</button>
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
