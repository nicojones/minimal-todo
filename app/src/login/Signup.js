import React, { useState } from 'react';
import { authService } from 'services/authService';
import { Redirect } from 'react-router-dom';

function Signup () {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'))
  const [signup, setSignup] = useState({
    email: 'nico@kupfer.es',
    username: 'nicojones',
    password: 'abcdef',
    confirm: 'abcdef',
    name: 'Nico Jones'
  });


  async function onSubmit(e) {
    e.preventDefault();

    authService.signup(signup).then((responseData) => {
      if (responseData.user) {
        setSignup({});
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
              value={ signup.email || '' } onChange={ (e) => setSignup({
              ...signup,
              email: e.target.value
            }) } placeholder="email" type="email" required
            />
            <input
              value={ signup.name || '' } onChange={ (e) => setSignup({
              ...signup,
              name: e.target.value
            }) } placeholder="name"  required
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
            <button type="submit" className="btn">sign up</button>
          </form>
      }
    </>
  )
}

export default Signup;
