import { TwitterPicker } from 'react-color';
import React, { useState } from 'react';

function ColorPicker ({ onChangeComplete, color }) {

  const [showColorPicker, setShowColorPicker] = useState(false);

  function setColor(colorChoice) {
    setShowColorPicker(false);
    onChangeComplete(colorChoice.hex);
  }

  return (
    <>
      <span className="relative">
        <button className="btn-invisible h-100" onClick={ () => setShowColorPicker(true) }>
          <span className="btn-colorpicker" style={ { backgroundColor: color } }/>
        </button>
        { showColorPicker ?
          <div className="colorpicker">
            <div className="backdrop" onClick={ () => setShowColorPicker(false) }/>
            <TwitterPicker
              color={ color }
              onChangeComplete={ setColor }
            />
          </div>
          : ''
        }
              </span>
    </>
  );
}

export default ColorPicker;
