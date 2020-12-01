import React from 'react';
import Footer from './Footer';
import Header from './Header';

import './_landing-body.scss';
import landingImage from 'assets/landing-img.svg';


function LandingPage ({ loaded }) {


  return (
    <>
      <Header loaded={ loaded }/>
      <div className="landing-content">
        <div className="flex-row w-100">
          <div className="f-50 flex-column">
            <br/>
            <h2 className="center-align">Minimal Todo App</h2>
            <h4 className="center-align">(in construction!)</h4>
          </div>
          <div className="f-50">
            <img src={ landingImage } alt="Present app" className="svg-img svg-img--big"/>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default LandingPage;
