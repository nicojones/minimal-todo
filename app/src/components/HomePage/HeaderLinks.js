import React from 'react';

function HeaderLinks ({ className }) {

  return (
    <ul className={ 'navbar-links-ul ' + className }>
      <li className="nav-item active">
        <a className="btn" href="#home">Home</a>
      </li>
      <li className="nav-item">
        <a className="btn" href="#about">About </a>
      </li>
      <li className="nav-item">
        <a className="btn" href="#features">Features</a>
      </li>
      {/*<li className="nav-item">*/}
      {/*  <a className="btn" href="#portfolio">Portfolio</a>*/}
      {/*</li>*/}
      {/*<li className="nav-item">*/}
      {/*  <a className="btn" href="#blog">Blog</a>*/}
      {/*</li>*/}
      {/*<li className="nav-item">*/}
      {/*  <a className="btn" href="#contact">Contact</a>*/}
      {/*</li>*/}
    </ul>
  );
}

export default HeaderLinks;
