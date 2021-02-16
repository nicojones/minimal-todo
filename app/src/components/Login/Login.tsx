import React, { useState } from 'react';
import { authService } from 'services/auth.service';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { showToast } from 'services/toast';
import { text, urls } from 'config';
import { LoginBox } from 'components/Login/LoginBox';
import { LoggedInUserContext } from 'App';
import { ILoginForm, PDefault } from '../../interfaces';
import firebase from 'firebase/app';


export function Login () {

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState<ILoginForm>({} as ILoginForm);
  const [loggedIn, setLoggedIn] = useState(false);

  // If the user is logged in already, redirect to the app!
  if (React.useContext(LoggedInUserContext)) {
    history.push(urls.app);
    return null;
  }

  function onSubmit (e: PDefault) {
    e.preventDefault();

    setLoading(true);

    authService
      .login(loginFormData)
      .then((responseData: firebase.auth.UserCredential /* Returns {user, error}! */) => {

        setLoading(false);

        if (responseData.user) {
          setLoginFormData({} as ILoginForm);
          setLoggedIn(true);
          showToast('success', text.login.success);
        } else {
          if ((responseData as any).error.code === 400) {
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
        loggedIn
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
                  <button type="submit" className="btn btn-block main-btn">{ text.login.login }</button>
                  <hr/>
                  <Link
                    to={ urls.signup } className="no-color u"
                  >{ text.login.noAccount } { text.login.signup }</Link>
                </div>
              </form>
            </LoginBox>
          </>
      }
    </>
  );
}
