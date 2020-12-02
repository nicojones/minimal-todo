import React, { useMemo } from 'react';
import { randArray } from 'functions/randArray';
import './_no-project.scss';

import balloonIcon from 'assets/task-bg/balloon.svg';
import boardIcon from 'assets/task-bg/board.svg';
import bookIcon from 'assets/task-bg/book.svg';
import calendarIcon from 'assets/task-bg/calendar.svg';
import musicIcon from 'assets/task-bg/music.svg';
import puzzleIcon from 'assets/task-bg/puzzle.svg';
import scienceIcon from 'assets/task-bg/science.svg';

const icons = [balloonIcon, boardIcon, bookIcon, calendarIcon, musicIcon, puzzleIcon, scienceIcon];

function NoProject ({ className, setShowSidebar, inspireText, addText }) {

  const myIcon = useMemo(() => {
    return randArray(icons);
  }, []);

  return (
    <>
      <div className={ 'no-project ' + className }>
        <h5 className="center-align">{ inspireText }</h5>
        <img alt="inspiration" src={ myIcon } className="no-task-img"/>
        { addText && <button
          className="btn btn-border left-align flex-center-self subtle"
          onClick={ () => setShowSidebar(true) }
        >{ addText }</button> }
      </div>
    </>
  );
}

export default NoProject;
