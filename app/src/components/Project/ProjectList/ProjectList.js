import React, { useEffect, useState } from 'react';
import { text } from 'config/text';
import './_project-list.scss';
import projectService from 'services/projectService';
import ProjectListDropdown from './ProjectListDropdown/ProjectListDropdown';
import cogoToast from 'cogo-toast';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import { constants } from 'config/constants';
import { urls } from '../../../config/urls';

function validProjectId (projectId, projects) {
  // If there's a project set in the URL and it's valid (it exists)
  if (projectId && projects.filter((p) => p.id === projectId).length) {
    return projectId;
  }
  return ''; // otherwise don't set any project.
}

function ProjectList ({ projectKey, setProjectKey }) {

  const [isLoading, setIsLoading] = useState('');
  const [projects, setProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const unsubscribeProjects = projectService.getListOfProjects((_projects) => {
      const _projectKey = validProjectId(projectKey, _projects);
      _projectKey && setProjectKey(_projectKey);
      setProjects(_projects);
    });

    return () => {
      unsubscribeProjects && unsubscribeProjects();
    };
  }, [ ]);

  function addNewProject (e) {
    e.preventDefault();

    setIsLoading('new');

    projectService
      .newProject({ name: newProjectName, color: constants.defaultProjectColor })
      .then((snap) => {
        setNewProjectName('');
        setIsLoading('');
        setProjectKey(snap.id);
      });
  }

  async function deleteProject (project) {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(project.id);
      await projectService.deleteProject(project);
      setProjectKey('');
      setIsLoading('');
    }
  }

  function setProject (projectId) {
    if (projectId === projectKey) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    setProjectKey(projectId);
  }

  async function changeColor (project, hexColor) {
    const result = await projectService.updateProject({
      ...project,
      color: hexColor
    });
    console.log('RESULT', result);
  }

  async function onAction (actionName, project) {
    switch (actionName) {
      case 'delete':
        await deleteProject(project);
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

  return (
    <>
      <h5 className="center-align">{ text.project.s }</h5>
      <ul className="projects-list flex-column">
        <li key={ urls.inboxUrl } className={ 'mb-5 parent-hover flex-row' + (projectKey === urls.inboxUrl ? ' selected' : '') }>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button className="btn-invisible left left-align ps-6" onClick={ () => setProject(urls.inboxUrl) }>{ text.drawer.inbox._ }</button>
        </li>
        {
          projects.map((proj) =>
            <li
              key={ proj.id }
              className={ 'mb-5 parent-hover flex-row' + (projectKey === proj.id ? ' selected' : '') + (isLoading === proj.id ? ' loader-input' : '') }
            >
              <ProjectListDropdown project={ proj } onAction={ onAction }/>
              <ColorPicker color={ proj.color } onChangeComplete={ (e) => changeColor(proj, e) } />
              <button className="btn-invisible left left-align ps-6" onClick={ () => setProject(proj.id) }>
                { proj.name }
                {
                  proj.shared &&
                  <i
                    className="tiny material-icons subtle left mr-5"
                    title={ text.sharedProject }
                  >people_outline</i>
                }
                {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/ }
              </button>
            </li>
          )
        }
        <li key="new-project" className="mb-5 parent-hover flex-row">
          <button className="btn-invisible child-hover ch-hidden left">
            <label htmlFor="new-project-input" className="pointer">
              <i className="tiny material-icons subtle">add</i>
            </label>
          </button>
          <form
            onSubmit={ addNewProject }
            className={ 'add-project flex-row' + (isLoading === 'new' ? ' loader-input' : '') }
          >
            <input
              className="invisible left-align"
              onChange={ (e) => setNewProjectName(e.target.value) }
              required minLength="3"
              disabled={ isLoading === 'new' }
              autoComplete="off"
              value={ newProjectName }
              id="new-project-input"
              placeholder={ text.project.add.ph }
            />
          </form>

        </li>
      </ul>
    </>
  );
}


export default ProjectList;
