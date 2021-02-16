import React, { useState } from 'react';
import { projectService } from 'services/project.service';
import { text } from 'config';
import { IProject } from 'interfaces';


interface ProjectListDropdownAttrs {
  project: IProject;
  onDelete: (project: IProject) => any;
}
export function ProjectListDropdown ({ project, onDelete }: ProjectListDropdownAttrs) {

  /**
   * @deprecated PLEASE REMOVE
   * @param actionName
   * @param _project
   * @returns {Promise<void>}
   */
  async function onAction (actionName: 'delete' | 'share', _project: IProject) {
    switch (actionName) {
      case 'delete':
        await onDelete(_project);
        break;
      case 'share':
        const userEmail = prompt('User Email to join?');
        if (userEmail) {
          const user = await projectService.getUserByEmail(userEmail);
          if (!user) {
            return;
          }
          await projectService.addUserToProject(_project, user.username);
        }
        break;
      default:
        break;
    }
  }

  const [dropdownShown, setDropdownShown] = useState(false);

  return (
    <>
      <button className="btn child-hover ml-auto" onClick={ () => setDropdownShown(true) }>
        <i className="tiny material-icons subtle">more_horiz</i>
      </button>
      {
        dropdownShown &&
        <>
          <ul className="dropdown dd-left" onClick={ () => setDropdownShown(false) }>
            <li className="dropdown-item">
              <button className="ib left left-align w-100 p-10" onClick={ () => onAction('delete', project) }>
                <i className="tiny material-icons subtle">delete</i> {text.project.delete._}
              </button>
            </li>
            <li className="dropdown-item">
              <button className="ib left left-align w-100 p-10" onClick={ () => onAction('share', project) }>
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
