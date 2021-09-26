import React, { Dispatch, SetStateAction, useMemo } from "react";
import "./_no-project.scss";

import balloonIcon from "assets/task-bg/balloon.svg";
import boardIcon from "assets/task-bg/board.svg";
import bookIcon from "assets/task-bg/book.svg";
import calendarIcon from "assets/task-bg/calendar.svg";
import musicIcon from "assets/task-bg/music.svg";
import puzzleIcon from "assets/task-bg/puzzle.svg";
import scienceIcon from "assets/task-bg/science.svg";
import { randArray } from "functions/rand-array";

const icons = [
  balloonIcon,
  boardIcon,
  bookIcon,
  calendarIcon,
  musicIcon,
  puzzleIcon,
  scienceIcon,
];

interface NoProjectAttrs {
  className: string;
  setShowSidebar?: Dispatch<SetStateAction<boolean>>;
  inspireText: string;
  addText?: string;
}
export const NoProject = ({
  className,
  setShowSidebar,
  inspireText,
  addText,
}: NoProjectAttrs) => {
  const myIcon = useMemo(() => {
    return randArray(icons);
  }, []);

  return (
    <div className={"no-project " + className}>
      <h5 className="center-align">{inspireText}</h5>
      <img alt="inspiration" src={myIcon} className="no-task-img" />
      {addText && (
        <button
          className="btn btn-border left-align flex-center-self subtle"
          onClick={() => setShowSidebar && setShowSidebar(true)}
        >
          {addText}
        </button>
      )}
    </div>
  );
};
