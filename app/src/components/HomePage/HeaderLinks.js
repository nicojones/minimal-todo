import React from 'react';

function HeaderLinks ({ className }) {

  return (
    <ul className={ 'navbar-links-ul ' + className }>
      <li className="nav-item active">
        <a className="btn btn-flat" href="#home">Home</a>
      </li>
      <li className="nav-item">
        <a className="btn btn-flat" href="#about">About </a>
      </li>
      <li className="nav-item">
        <a className="btn btn-flat" href="#features">Features</a>
      </li>
      {/*<li className="nav-item">*/}
      {/*  <a className="btn btn-flat" href="#portfolio">Portfolio</a>*/}
      {/*</li>*/}
      {/*<li className="nav-item">*/}
      {/*  <a className="btn btn-flat" href="#blog">Blog</a>*/}
      {/*</li>*/}
      {/*<li className="nav-item">*/}
      {/*  <a className="btn btn-flat" href="#contact">Contact</a>*/}
      {/*</li>*/}
    </ul>
  );
}

export default HeaderLinks;
