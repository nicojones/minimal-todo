import './_app-loader.scss';
import { text } from 'text';
import React from 'react';

function Loader () {
  return (
    <span className="app-loader">
      <span>{ text.loading }</span>
    </span>
  )
}

export default Loader;
