import React, { useState } from 'react';
import { text } from 'config/text';
import projectService from 'services/projectService';

function ProjectListDropdown ({ project, onDelete }) {

  /**
   * @deprecated PLEASE REMOVE
   * @param actionName
   * @param _project
   * @returns {Promise<void>}
   */
  async function onAction (actionName, _project) {
    switch (actionName) {
      case 'delete':
        await onDelete(_project);
        break;
      case 'share':
        const userEmail = prompt('User Email to join?');
        const user = await projectService.getUserByEmail(userEmail);
        if (!user) {
          return;
        }
        await projectService.addUserToProject(_project, user.username);
        break;
      default:
        break;
    }
  }

  const [dropdownShown, setDropdownShown] = useState(false);

  return (
    <>
      <button className="btn-invisible child-hover ch-hidden ml-auto" onClick={ () => setDropdownShown(true) }>
        <i className="tiny material-icons subtle">more_horiz</i>
      </button>
      {
        dropdownShown &&
        <>
          <ul className="dropdown dd-left" onClick={ () => setDropdownShown(false) }>
            <li className="dropdown-item">
              <button className="btn-invisible left left-align w-100 p-10" onClick={ () => onAction('delete', project) }>
                <i className="tiny material-icons subtle">delete</i> {text.project.delete._}
              </button>
            </li>
            <li className="dropdown-item">
              <button className="btn-invisible left left-align w-100 p-10" onClick={ () => onAction('share', project) }>
                <i className="tiny material-icons subtle">person_add</i> {text.project.share}
              </button>
            </li>
          </ul>
          <div className="backdrop" onClick={ () => setDropdownShown(false) }/>
        </>
      }
    </>
  );
}

export default ProjectListDropdown;
