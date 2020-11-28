import React, { useState } from 'react';
import './_project-options.scss';
import { constants } from '../../../config/constants';


function ProjectOptions ({ sort, setSort, children }) {

  const [sortDropdown, showSortDropdown] = useState(false);
  const [moreDropdown, showMoreDropdown] = useState(false);

  return (
    <>
      <div className="buttons">
        <>
          { sort && // Only if the `sort` is passed from the parent.
          <button className="btn-invisible" onClick={ () => showSortDropdown(true) }>
            <i className="material-icons">swap_vert</i>
          </button>
          }
          {
            sortDropdown &&
            <>
              <ul className="dropdown dd-left dd-0 dd-high">
                {
                  constants.sort.map((d) =>
                    <li key={ d.sort } className={ 'dropdown-item' + (d.sort === sort ? ' selected' : '') }>
                      <button className="btn-invisible" onClick={ () => setSort(d.sort) }>
                        { d.icon && <i className="material-icons tiny left">{ d.icon }</i> }
                        { d.name }
                      </button>
                    </li>
                  )
                }
              </ul>
              <div className="backdrop" onClick={ () => showSortDropdown(false) }/>
            </>
          }
          {
            children && // Only if the `more` is passed from the parent.
            <button className="btn-invisible" onClick={ () => showMoreDropdown(true) }>
              <i className="material-icons">more_horiz</i></button>
          }
          {
            moreDropdown &&
            <>
              <ul className="dropdown dd-left dd-0 dd-high">
                { children }
              </ul>
              <div className="backdrop" onClick={ () => showMoreDropdown(false) }/>
            </>
          }
        </>
      </div>
    </>
  );
}

export default ProjectOptions;