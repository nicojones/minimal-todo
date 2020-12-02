import React, { useState } from 'react';
import './_project-options.scss';
import { constants } from '../../../config/constants';
import { text } from '../../../config/text';
import Tooltip from '../../Tooltip/Tooltip';


function ProjectOptions ({ sort, setSort, children }) {

  const [sortDropdown, showSortDropdown] = useState(false);
  const [moreDropdown, showMoreDropdown] = useState(false);

  return (
    <>
      <div className="buttons">
        <>
          <Tooltip/>
          { sort && // Only if the `sort` is passed from the parent.
          <button className="btn" onClick={ () => showSortDropdown(true) } data-tip={ text.sort._ }>
            <i className="material-icons">swap_vert</i>
          </button>
          }
          {
            sortDropdown &&
            <>
              <ul className="dropdown dd-left dd-20 dd-high">
                {
                  constants.sort.map((d) =>
                    <li key={ d.sort } className={ 'dropdown-item' }>
                      <button className="ib" onClick={ () => setSort(d.sort) }>
                        { d.icon && <i className="material-icons tiny left btn-p">{ d.icon }</i> }
                        <span className={ (d.sort === sort ? ' bold' : '') }>{ d.name }</span>
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
            <button className="btn" onClick={ () => showMoreDropdown(true) }>
              <i className="material-icons" data-tip={ text.project.more }>more_horiz</i></button>
          }
          {
            moreDropdown &&
            <>
              <ul className="dropdown dd-left dd-20 dd-high">
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
