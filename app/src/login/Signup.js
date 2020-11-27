import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { text } from 'config/text';
import { urls } from 'config/urls';
import { LoggedInUserContext } from '../App';
import cogoToast from 'cogo-toast';
import LoginBox from './LoginBox';
import { constants } from 'config/constants';

function Signup () {

  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [signup, setSignup] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState({});


  async function onSubmit (e) {
    e.preventDefault();

    const _signupError = authService.validateSignup(signup);
    const errors = Object.values(_signupError);
    if (!errors.length) {
      setLoading(true);
      authService
        .signup(signup)
        .then((responseData) => {
          setLoading(false);
          if (responseData.user) {
            cogoToast.success(text.login.signupSuccess, constants.toast);
            setSignup({});
            setIsLoggedIn(true);
          }
        })
        .catch(({ response } ) => {
          if (response.data && response.data.code) {
            authService.loginCatch(response.data);
          } else {
            setSignupError(response.data);
            const errors = Object.values(response.data);
            errors.length && cogoToast.error(errors[0], constants.toast);
          }
          setLoading(false);
        });
    } else {
      setSignupError(_signupError);
      errors.length && cogoToast.error(errors[0], constants.toast);
    }
  }

  // If the user is logged in already, redirect to the app!
  if (React.useContext(LoggedInUserContext)) {
    history.push(urls.app);
    return null;
  }

  return (
    <>
      {
        isLoggedIn
          ? <Redirect to="/app"/>
          :
          <>
            <LoginBox title={ text.login.signup } loading={ loading }>
              <form onSubmit={ onSubmit } className="flex-center-self">
                <input
                  value={ signup.email || '' } onChange={ (e) => setSignup({
                  ...signup,
                  email: e.target.value
                }) } placeholder="email" type="email" required autoFocus autoComplete="off"
                />
                { signupError.email && <small>{ signupError.email }</small> }
                <input
                  value={ signup.name || '' } onChange={ (e) => setSignup({
                  ...signup,
                  name: e.target.value
                }) } placeholder="name" required autoComplete="off"
                />
                { signupError.name && <small>{ signupError.name }</small> }
                <input
                  value={ signup.username || '' } onChange={ (e) => setSignup({
                  ...signup,
                  username: e.target.value
                }) } placeholder="username" required autoComplete="off"
                />
                { signupError.username && <small>{ signupError.username }</small> }
                <input
                  value={ signup.password || '' } onChange={ (e) => setSignup({
                  ...signup,
                  password: e.target.value
                }) } placeholder="password" type="password" required autoComplete="off"
                />
                { signupError.password && <small>{ signupError.password }</small> }
                <input
                  value={ signup.confirm || '' } onChange={ (e) => setSignup({
                  ...signup,
                  confirm: e.target.value
                }) } placeholder="confirm" type="password" required autoComplete="off"
                />
                { signupError.password && <small>{ signupError.password }</small> }
                <div className="flex-row">
                  <button type="submit" className="btn btn-block">{ text.login.signup }</button>
                  <Link to={ urls.login } className="btn-flat">{ text.login.yesAccount } { text.login.login }</Link>
                </div>
              </form>
            </LoginBox>
          </>
      }
    </>
  );
}

export default Signup;
