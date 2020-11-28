import React, { useState } from 'react';
import { text } from 'config/text';
import projectService from 'services/projectService';
import cogoToast from 'cogo-toast';

function ProjectListDropdown ({ project }) {

  /**
   * @deprecated PLEASE REMOVE
   * @param actionName
   * @param project
   * @returns {Promise<void>}
   */
  async function onAction (actionName, project) {
    switch (actionName) {
      case 'delete':
        await projectService.deleteProject(project);
        break;
      case 'share':
        const userEmail = prompt('User Email to join?');
        const user = await projectService.getUserByEmail(userEmail);
        if (!user) {
          cogoToast.error(text.genericError);
          console.error('error: ', user);
          return;
        }
        await projectService.addUserToProject(project, user.username);
        break;
      default:
        break;
    }
  }

  const [dropdownShown, setDropdownShown] = useState(false);

  return (
    <>
      <button className="btn-invisible child-hover ch-hidden left" onClick={ () => setDropdownShown(true) }>
        <i className="tiny material-icons subtle">more_horiz</i>
      </button>
      {
        dropdownShown &&
        <>
          <ul className="dropdown dd-right" onClick={ () => setDropdownShown(false) }>
            <li className="dropdown-item">
              <button className="btn-invisible left left-align w-100" onClick={ () => onAction('delete', project) }>
                <i className="tiny material-icons subtle">delete</i> {text.project.delete._}
              </button>
            </li>
            <li className="dropdown-item">
              <button className="btn-invisible left left-align w-100" onClick={ () => onAction('share', project) }>
                <i className="tiny material-icons subtle">people_outline</i> {text.project.share}
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
