import TwitterPicker from 'react-color/lib/Twitter';
import React, { useState } from 'react';

function ColorPicker ({ onChangeComplete, color, icon }) {

  const [showColorPicker, setShowColorPicker] = useState(false);

  function setColor (colorChoice) {
    setShowColorPicker(false);
    onChangeComplete(colorChoice.hex);
  }

  return (
    <>
      <span className="relative">
        <button className="btn-invisible h-100" onClick={ () => setShowColorPicker(true) }>
          <i className="material-icons tiny left m0" style={ { color: color } }>{ icon }</i>
        </button>
        { showColorPicker ?
          <>
            <div className="color-picker">
              <TwitterPicker
                color={ color }
                onChangeComplete={ setColor }
              />
            </div>
            <div className="backdrop" onClick={ () => setShowColorPicker(false) }/>
          </>
          : ''
        }
              </span>
    </>
  );
}

export default ColorPicker;
