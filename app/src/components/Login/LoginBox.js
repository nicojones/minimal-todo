import React from 'react';
import './_login-box.scss';
import Logo from 'components/Logo/Logo';

function LoginBox ({ children, title, loading }) {

  return (
    <>
      <Logo/>

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
