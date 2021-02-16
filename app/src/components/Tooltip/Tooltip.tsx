import React from 'react';
import ReactTooltip from 'react-tooltip';


export function Tooltip () {
  return (
    (window as any).isSmallScreen
      ? <></>
      : <ReactTooltip place="bottom" type="dark" effect="solid" delayShow={ 1000 } html={ true }/>
  );
}

