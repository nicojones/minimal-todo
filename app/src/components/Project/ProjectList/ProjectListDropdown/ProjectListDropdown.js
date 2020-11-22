import React, { useState } from 'react';

function ProjectListDropdown ({ project, onAction }) {

  const [dropdownShown, setDropdownShown] = useState(false);

  return (
    <>
      <button className="btn-invisible child-hover ch-hidden left" onClick={ () => setDropdownShown(true) }>
        <i className="tiny material-icons subtle">more_horiz</i>
      </button>
      {
        dropdownShown &&
        <>
          <ul className="pl-dropdown" onClick={ () => setDropdownShown(false) }>
            <li className="pl-dropdown-item">
              <button className="btn-invisible left left-align w-100" onClick={ () => onAction('delete', project) }>
                <i className="tiny material-icons subtle">delete</i> Delete Project
              </button>
            </li>
            <li className="pl-dropdown-item">
              <button className="btn-invisible left left-align w-100" onClick={ () => onAction('share', project) }>
                <i className="tiny material-icons subtle">people_outline</i> Share Project
              </button>
            </li>
          </ul>
          <div className="pl-backdrop" onClick={ () => setDropdownShown(false) }/>
        </>
      }
    </>
  );
}

export default ProjectListDropdown;
