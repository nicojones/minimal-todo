import React from 'react';
import { text } from 'config/text';
import HeaderLinks from './HeaderLinks';

function Footer () {
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
          <div className="container">
            <small className="left subtle">Copyright &copy; { new Date().getFullYear() } Nico Kupfer</small>
            <small className="right subtle">
              <a
                className="btn" href="https://github.com/nicojones/todolist-react"
                target="_blank"
              >Code on Github</a>
            </small>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
