import React from 'react';
import './_login-box.scss';
import { Link } from 'react-router-dom';
import { urls } from 'config/urls';
import todoLogo from 'assets/logo.png';

function LoginBox ({ children, title, loading }) {

  return (
    <>
      <Link className="btn center-logo" to={ urls.home }>
        <img src={ todoLogo } alt="Logo" width="100%"/>
      </Link>

      <div className={ 'flex-column vh-100 place-center' + ( loading ? ' loader-input cover' : '' ) }>
        <div className="login-box relative">
          {/*<button className="btn go-back-close" onClick={ () => history.push(urls.home)}>*/}
          {/*  <i className="material-icons medium">close</i>*/}
          {/*</button>*/}
          { title && <h5 className="mt-5">{ title }</h5> }
          { children }
        </div>
      </div>
    </>
  );
}

export default LoginBox;
