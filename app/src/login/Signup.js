import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { text } from 'text';
import { urls } from 'urls';
import { LoggedInUserContext } from '../App';
import Loader from 'components/Loader/Loader';

function Signup () {

  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [signup, setSignup] = useState({});
  const [loading, setLoading] = useState(false);


  async function onSubmit (e) {
    e.preventDefault();

    const signupError = authService.validateSignup(signup);
    if (!signupError) {
      setLoading(true);
      authService.signup(signup).then((responseData) => {
        setLoading(false);
        if (responseData.user) {
          setSignup({});
          setIsLoggedIn(true);
        } else {
          alert('error! please see console');
          console.log(responseData);
        }
      }).catch(() => {
        setLoading(false);
      });
    } else {
      alert(signupError);
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
                <input
                  value={ signup.name || '' } onChange={ (e) => setSignup({
                  ...signup,
                  name: e.target.value
                }) } placeholder="name" required
                />
                <input
                  value={ signup.username || '' } onChange={ (e) => setSignup({
                  ...signup,
                  username: e.target.value
                }) } placeholder="username" required
                />
                <input
                  value={ signup.password || '' } onChange={ (e) => setSignup({
                  ...signup,
                  password: e.target.value
                }) } placeholder="password" type="password" required
                />
                <input
                  value={ signup.confirm || '' } onChange={ (e) => setSignup({
                  ...signup,
                  confirm: e.target.value
                }) } placeholder="confirm" type="password" required
                />
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
