import React from 'react';
import './_login-box.scss';

function LoginBox ({ children, title, loading }) {
  return (
    <>
      <div className={ 'flex-column vh-100 place-center' + ( loading ? ' loader-input cover' : '' ) }>
        <div className="login-box">
          { title && <h5 className="mt-5">{ title }</h5> }
          { children }
        </div>
      </div>
    </>
  );
}

export default LoginBox;
