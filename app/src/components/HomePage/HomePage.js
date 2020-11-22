import React from 'react';
import Footer from './Footer';
import Header from './Header';


function HomePage ({ loaded }) {


  return (
    <>
      <Header loaded={ loaded }/>
      <div
        style={ {
          height: '300px',
          display: 'block'
        } }
      >
        <h4 className="flex-center-self center-align">Welcome to the best todo-app</h4>
      </div>
      <Footer/>
    </>
  );
}

export default HomePage;
