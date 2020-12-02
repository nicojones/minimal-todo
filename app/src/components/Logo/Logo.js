import { urls } from 'config/urls';
import todoLogo from 'assets/logo.png';
import { Link } from 'react-router-dom';
import React from 'react';

function Logo () {
  return (
    <>
      <Link className="btn center-logo" to={ urls.home }>
        <img src={ todoLogo } alt="Logo" width="100%"/>
      </Link>
    </>
  )
}

export default Logo;
