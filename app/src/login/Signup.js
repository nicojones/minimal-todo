import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { text } from 'config/text';
import { urls } from 'config/urls';
import { LoggedInUserContext } from '../App';
import Loader from 'components/Loader/Loader';
import cogoToast from 'cogo-toast';
import { defaultToast } from 'config/defaultToast';

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
      authService.signup(signup).then((responseData) => {
        setLoading(false);
        if (responseData.user) {
          cogoToast.success(text.login.signupSuccess, defaultToast);
          setSignup({});
          setIsLoggedIn(true);
        }
      }).catch(({ response }) => {
        setSignupError(response.data);
        const errors = Object.values(response.data);
        errors.length && cogoToast.error(errors[0], defaultToast);
        setLoading(false);
      });
    } else {
      setSignupError(_signupError)
      errors.length && cogoToast.error(errors[0], defaultToast);
    }
  }

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
            { loading && <Loader/> }
            <div className="row">
              <form onSubmit={ onSubmit } className="flex-center-self center-block">
                <input
                  value={ signup.email || '' } onChange={ (e) => setSignup({
                  ...signup,
                  email: e.target.value
                }) } placeholder="email" type="email" required autoFocus
                />
                { signupError.email && <small>{ signupError.email }</small>}
                <input
                  value={ signup.name || '' } onChange={ (e) => setSignup({
                  ...signup,
                  name: e.target.value
                }) } placeholder="name" required
                />
                { signupError.name && <small>{ signupError.name }</small>}
                <input
                  value={ signup.username || '' } onChange={ (e) => setSignup({
                  ...signup,
                  username: e.target.value
                }) } placeholder="username" required
                />
                { signupError.username && <small>{ signupError.username }</small>}
                <input
                  value={ signup.password || '' } onChange={ (e) => setSignup({
                  ...signup,
                  password: e.target.value
                }) } placeholder="password" type="password" required
                />
                { signupError.password && <small>{ signupError.password }</small>}
                <input
                  value={ signup.confirm || '' } onChange={ (e) => setSignup({
                  ...signup,
                  confirm: e.target.value
                }) } placeholder="confirm" type="password" required
                />
                { signupError.password && <small>{ signupError.password }</small>}
                <div className="flex-row">
                  <button type="submit" className="btn btn-block">{ text.login.signup }</button>
                  <Link to={ urls.login } className="btn-flat">{ text.login.yesAccount } { text.login.login }</Link>
                </div>
              </form>
            </div>
          </>
      }
    </>
  );
}

export default Signup;
