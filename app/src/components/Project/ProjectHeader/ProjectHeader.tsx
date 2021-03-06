import React, { Dispatch, SetStateAction, useContext } from 'react';
import { projectService } from 'services/project.service';
import { showToast } from 'services/toast';
import { text } from 'config';
import { ProjectOptions } from 'components/Project/ProjectOptions/ProjectOptions';
import { ProjectContext } from 'TodoApp';
import { IProject, LoadingStates, PDefault } from 'interfaces';


interface ProjectHeaderAttrs {
  projectFunctions: {
    changeToProject: (project: IProject) => any;
    projectName: IProject['name'];
    setProjectName: Dispatch<SetStateAction<IProject['name']>>;
    saveListName: (event: PDefault) => any;
    editListName: boolean;
    setEditListName: Dispatch<SetStateAction<boolean>>;
    showCompleted: boolean;
    setShowCompleted: Dispatch<SetStateAction<boolean>>;
    sort: string;
    setSort: Dispatch<SetStateAction<string>>
  };
  isLoading: LoadingStates;
}

export function ProjectHeader ({ projectFunctions, isLoading }: ProjectHeaderAttrs) {

  const project = useContext(ProjectContext);
  const psc = projectFunctions.showCompleted;

  async function deleteProject () {
    console.log('THIS SHOULD NOT WORK!!!');
    if (window.confirm(text.project.delete._)) {
      await projectService.deleteProject(project);
      // @ts-ignore;
      projectFunctions.setProject({ deleted: true });
    }
  }

  async function deleteTasks () {
    if (window.confirm(text.project.delete.tasks)) {
      await projectService.deleteProjectTasks(project);
    }
  }

  async function share () {
    const userEmail: string | null = prompt('User Email to join?');
    if (userEmail) {
      const user = await projectService.getUserByEmail(userEmail);
      if (!user) {
        showToast('error', text.genericError);
        console.error('error: ', user);
        return;
      }
      await projectService.addUserToProject(project, user.username);
    }
  }

  async function toggleShowCompleted (showCompleted: boolean) {
    console.log(showCompleted);
    projectFunctions.setShowCompleted(showCompleted);
    // await projectService.updateProject({
    //   ...project,
    //   showCompleted
    // });
  }

  return (
    <>
      {
        projectFunctions.editListName
          ? <form
            onSubmit={ projectFunctions.saveListName }
            className={ 'flex-row ' + (isLoading === 'n' ? ' loader-input' : '') }
          >
            <input
              className="as-title h5 project-title" autoFocus /*onBlur={ project.saveListName }*/
              value={ projectFunctions.projectName }
              disabled={ isLoading === 'n' }
              onChange={ (e) => projectFunctions.setProjectName(e.target.value) }
            />
            <button className="ib material-icons" type="submit">save</button>
            <button
              className="ib material-icons" onClick={ () => projectFunctions.setEditListName(false) }
            >close
            </button>
          </form>
          : <div className="project-title-bar" data-tip={ text.project.title._ }>
            <h5
              className="project-title" onClick={ () => projectFunctions.setEditListName(true) }
            >{ projectFunctions.projectName }</h5>
            <ProjectOptions sort={ projectFunctions.sort } setSort={ projectFunctions.setSort }>
              <li className="dropdown-item" key="completed">
                <button className="ib w-100 left-align" onClick={ () => toggleShowCompleted(!psc) }>
                  <i className="material-icons tiny left btn-pr">{ psc ? 'check_box_outline_blank' : 'check_box' }</i>
                  { psc ? text.hideCompleted : text.showCompleted }
                </button>
              </li>
              <li className="dropdown-item" key="share">
                <button className="ib w-100 left-align" onClick={ () => share() }>
                  <i className="material-icons tiny left btn-pr">person_add</i>
                  { text.project.share }
                </button>
              </li>
              <li className="dropdown-item" key="tasks">
                <button className="ib w-100 left-align" onClick={ () => deleteTasks() }>
                  <i className="material-icons tiny left btn-pr">delete_forever</i>
                  { text.project.delete.tasks }
                </button>
              </li>
              <li className="dropdown-item" key="delete">
                <button className="ib w-100 left-align" onClick={ () => deleteProject() }>
                  <i className="material-icons tiny left btn-pr">delete</i>
                  { text.project.delete._ }
                </button>
              </li>
            </ProjectOptions>
          </div>
      }
    </>
  );
}
