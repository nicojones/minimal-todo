import React, { useContext } from 'react';
import { text } from 'config/text';
import { ProjectContext } from 'TodoApp';
import ProjectOptions from 'components/Project/ProjectOptions/ProjectOptions';
import projectService from 'services/projectService';
import cogoToast from 'cogo-toast';

function ProjectHeader ({ projectFunctions, isLoading }) {

  const project = useContext(ProjectContext);
  const psc = projectFunctions.showCompleted;

  async function deleteProject () {
    if (window.confirm(text.project.delete._)) {
      await projectService.deleteProject(project);
    }
  }

  async function deleteTasks () {
    if (window.confirm(text.project.delete.tasks)) {
      await projectService.deleteProjectTasks(project);
    }
  }

  async function share () {
    const userEmail = prompt('User Email to join?');
    const user = await projectService.getUserByEmail(userEmail);
    if (!user) {
      cogoToast.error(text.genericError);
      console.error('error: ', user);
      return;
    }
    await projectService.addUserToProject(project, user.username);
  }

  async function toggleShowCompleted (showCompleted) {
    projectFunctions.setShowCompleted(showCompleted);
    await projectService.updateProject({ ...project, showCompleted });
  }

  return (
    projectFunctions.editListName
      ? <form onSubmit={ projectFunctions.saveListName } className={ (isLoading === 'name' ? ' loader-input' : '') }>
        <input
          className="as-title m0 invisible h5" autoFocus /*onBlur={ project.saveListName }*/
          value={ projectFunctions.projectName }
          disabled={ isLoading === 'name' }
          onBlur={ () => projectFunctions.setEditListName(false) }
          onChange={ (e) => projectFunctions.setProjectName(e.target.value) }
        />
      </form>
      : <div className="project-title-bar">
        <div className="flex-row">
          <h5
            className="project-title" onClick={ () => projectFunctions.setEditListName(true) }
          >{ projectFunctions.projectName }</h5>
        </div>
        <ProjectOptions sort={ projectFunctions.sort } setSort={ projectFunctions.setSort }>
          <li className="dropdown-item" key="completed">
            <button className="btn-invisible w-100 left-align" onClick={ () => toggleShowCompleted(!psc) }>
              <i className="material-icons tiny left btn-pr">{ psc ? 'check_box_outline_blank' : 'check_box' }</i>
              { psc ? text.hideCompleted : text.showCompleted }
            </button>
          </li>
          <li className="dropdown-item" key="share">
            <button className="btn-invisible w-100 left-align" onClick={ () => share() }>
              <i className="material-icons tiny left btn-pr">person_add</i>
              { text.project.share }
            </button>
          </li>
          <li className="dropdown-item" key="tasks">
            <button className="btn-invisible w-100 left-align" onClick={ () => deleteTasks() }>
              <i className="material-icons tiny left btn-pr">delete_forever</i>
              { text.project.delete.tasks }
            </button>
          </li>
          <li className="dropdown-item" key="delete">
            <button className="btn-invisible w-100 left-align" onClick={ () => deleteProject() }>
              <i className="material-icons tiny left btn-pr">delete</i>
              { text.project.delete._ }
            </button>
          </li>
        </ProjectOptions>
      </div>
  );
}

export default ProjectHeader;
