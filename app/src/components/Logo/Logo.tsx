import todoLogo from 'assets/logo.png';
import { Link } from 'react-router-dom';
import React from 'react';
import { urls } from 'config';


export function Logo () {
  return (
    <>
      <Link className="btn center-logo" to={ urls.home }>
        <img src={ todoLogo } alt="Logo" width="100%"/>
      </Link>
    </>
  )
}
