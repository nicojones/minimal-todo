import React from 'react';
import { HeaderLinks } from 'components/HomePage/HeaderLinks';
import { text } from 'config';


export function Footer () {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="">{ text.appName }</h5>
              <p>{ text.appDesc }</p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="">Links</h5>
              <HeaderLinks className={ 'footer-links' }/>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="container copyright__content">
            <small className="left subtle">Copyright &copy; { new Date().getFullYear() } Nico Kupfer</small>
            <small className="right subtle">
              <a
                className="no-color u" href="https://github.com/nicojones/minimal-todo"
                target="_blank"
              >Code on Github</a>
            </small>
          </div>
        </div>
      </footer>
    </>
  );
}
