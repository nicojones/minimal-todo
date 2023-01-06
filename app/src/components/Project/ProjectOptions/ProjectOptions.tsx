import React, { Dispatch, SetStateAction, useState } from "react";
import "./_project-options.scss";
import { Tooltip } from "components/Tooltip/Tooltip";
import { constants, text } from "config";
import { IProject } from "interfaces";

interface ProjectOptionsAttrs {
  sort: string;
  setSort: (sort: string) => any; // Promise<IProject | void>; // Dispatch<SetStateAction<string>>;
  children?: any;
  moreDropdown: boolean;
  showMoreDropdown?: Dispatch<SetStateAction<boolean>>;
}
export const ProjectOptions = ({
  sort,
  setSort,
  children,
  moreDropdown,
  showMoreDropdown
}: ProjectOptionsAttrs) => {
  const [sortDropdown, showSortDropdown] = useState(false);
  

  return (
    <div className="buttons">
      <Tooltip anchorId="show-sort-dropdown"/>
      {sort && ( // Only if the `sort` is passed from the parent.
        <button
          className="btn"
          id="show-sort-dropdown"
          data-tooltip-content={text.sort._}
          onClick={() => showSortDropdown(true)}
        >
          <i className="material-icons">swap_vert</i>
        </button>
      )}
      {sortDropdown && (
        <>
          <ul className="dropdown dd-left dd-20 dd-high">
            {constants.sortOptions.map((d) => (
              <li key={d.sort} className={"dropdown-item"}>
                <button className="ib" onClick={() => setSort(d.sort)}>
                  {d.icon && (
                    <i className="material-icons tiny left btn-p">{d.icon}</i>
                  )}
                  <span className={d.sort === sort ? " bold" : ""}>
                    {d.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="backdrop" onClick={() => showSortDropdown(false)} />
        </>
      )}
      {children && ( // Only if the `more` is passed from the parent.
        <button className="btn" onClick={() => showMoreDropdown && showMoreDropdown(true)}>
          <i className="material-icons" data-tip={text.project.more}>
            more_horiz
          </i>
        </button>
      )}
      {moreDropdown && (
        <>
          <ul className="dropdown dd-left dd-20 dd-high">{children}</ul>
          <div className="backdrop" onClick={() => showMoreDropdown && showMoreDropdown(false)} />
        </>
      )}
    </div>
  );
};
