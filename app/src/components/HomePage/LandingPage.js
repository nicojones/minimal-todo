import React from 'react';
import Footer from './Footer';
import Header from './Header';

import './_landing-body.scss';
import landingImage from 'assets/landing/main.svg';
import todoImage from 'assets/landing/phone.svg';
import writeImage from 'assets/landing/write.svg';
import exploreImage from 'assets/landing/explore.svg';
import calendarImage from 'assets/landing/calendar.svg';
import createImage from 'assets/landing/create.svg';
import readImage from 'assets/landing/read.svg';
import FeatureBox from './FeatureBox';
import { text } from 'config/text';


function LandingPage ({ loaded }) {


  return (
    <>
      <Header loaded={ loaded }/>
      <div className="landing-content">
        <div className="flex-row w-100 flex-wrap">
          <div className="f-50 flex-column">
            <br/>
            <h2 className="center-align">{ text.landing.title }</h2>
            <h4 className="center-align">{ text.landing.sub }</h4>
            <h5 className="subtle center-align mb-15">(in construction!)</h5>
          </div>
          <div className="f-50 place-center">
            <img src={ landingImage } alt="Present app" className="svg-img svg-img--big"/>
          </div>
        </div>
        <div className="features-section">
          <FeatureBox img={ todoImage } title={ text.landing.feature.todo }/>
          <FeatureBox img={ writeImage } title={ text.landing.feature.write }/>
          <FeatureBox img={ calendarImage } title={ text.landing.feature.calendar }/>
          <FeatureBox img={ exploreImage } title={ text.landing.feature.explore }/>
          <FeatureBox img={ readImage } title={ text.landing.feature.read }/>
          <FeatureBox img={ createImage } title={ text.landing.feature.create }/>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default LandingPage;
