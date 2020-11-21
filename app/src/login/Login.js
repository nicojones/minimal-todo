import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect } from 'react-router-dom';

function Login () {

  const [login, setLogin] = useState({
    email: 'nico@kupfer.es',
    password: 'abcdef'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));


  function onSubmit(e) {
    e.preventDefault();

    authService.login(login).then((responseData) => {
      if (responseData.user) {
        setLogin({});
        setIsLoggedIn(true);
      } else {
        alert('error! please see console');
        console.log(responseData);
      }
    })
  }

  return (
    <>
      {
        isLoggedIn
          ? <Redirect to="/app"/>
          :
          <form onSubmit={ onSubmit } className="flex-center-self">
            <input
              value={ login.email || '' } onChange={ (e) => setLogin({
              ...login,
              email: e.target.value
            }) } placeholder="email" type="email"
            />
            <input
              value={ login.password || '' } onChange={ (e) => setLogin({
              ...login,
              password: e.target.value
            }) } placeholder="password" type="password"
            />
            <button type="submit">log in</button>
          </form>
      }
    </>
  )
}

export default Login;
