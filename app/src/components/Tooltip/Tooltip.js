import React from 'react';
import ReactTooltip from 'react-tooltip';

function Tooltip () {
  return (
    window.isSmallScreen
      ? ''
      : <ReactTooltip place="bottom" type="dark" effect="solid" delayShow={ 1000 } html={ true }/>
  );
}

export default Tooltip;
