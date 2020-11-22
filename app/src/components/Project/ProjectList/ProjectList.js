import React, { useEffect, useState } from 'react';
import { text } from 'text';
import './_project-list.scss';
import projectService from 'services/projectService';
import ProjectListDropdown from './ProjectListDropdown/ProjectListDropdown';
import { LoggedInUserContext } from '../../../App';
import { authService } from '../../../services/authService';

function validProjectId (projectId, projects) {
  // If there's a project set in the URL and it's valid (it exists)
  if (projectId && projects.filter((p) => p.id === projectId).length) {
    return projectId;
  }
  return ''; // otherwise don't set any project.
}

function ProjectList ({ projectKey, setProjectKey }) {

  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');

  const user = React.useContext(LoggedInUserContext);

  useEffect(() => {
    const unsubscribeProjects = projectService.getListOfProjects((_projects) => {
      setProjectKey(validProjectId(projectKey, _projects)); // set the first project as selected...
      setProjects(_projects);
    });

    return () => {
      unsubscribeProjects && unsubscribeProjects();
    };
  }, [projectKey]);

  function addNewProject (e) {
    e.preventDefault();

    setIsLoading(true);

    projectService
      .newProject({ name: newProjectName })
      .then((snap) => {
        setNewProjectName('');
        setIsLoading(false);
        setProjectKey(snap.id);
      });
  }

  async function deleteProject (project) {
    if (window.confirm(text.deleteProject)) {
      // setIsLoading(true);
      await projectService.deleteProject(project);
      setProjectKey('');
      // setIsLoading(false);
    }
  }

  function setProject (project) {
    if (project.id === projectKey) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    setProjectKey(project.id);
  }

  async function onAction (actionName, project) {
    switch (actionName) {
      case 'delete':
        await deleteProject(project);
        break;
      case 'share':
        const userEmail = prompt('User Email to join?');
        await projectService.getUserByEmail(userEmail).then(async (user) => {
          await projectService.addUserToProject(project, user.username);
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <h5 className="center-align">{ text.projects }</h5>
      <ul className="projects-list flex-column">
        {
          projects.map((proj) =>
            <li
              key={ proj.id } className={ (projectKey === proj.id ? 'selected' : '') + ' mb-5 parent-hover flex-row' }
            >
              <ProjectListDropdown project={ proj } onAction={ onAction }/>
              <button className="btn-invisible left left-align" onClick={ () => setProject(proj) }>
                {
                  proj.shared &&
                  <i
                    className="tiny material-icons subtle left mr-5"
                    title={ text.sharedProject }
                  >people_outline</i>
                }
                { proj.name }
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
          <form onSubmit={ addNewProject } className={ 'add-project flex-row' + (isLoading ? ' loader-input' : '') }>
            <input
              className="invisible subtle left-align"
              onChange={ (e) => setNewProjectName(e.target.value) }
              required minLength="3"
              value={ newProjectName }
              id="new-project-input"
              placeholder={ text.addProjectPh }
            />
          </form>

        </li>
      </ul>
      <small className="flex-row logout">
        <span className="left subtle">{ text.loggedInAs(user.email) }</span>
        <button className="btn-invisible right subtle"
          onClick={ authService.logout }>{ text.login.logout }</button>
      </small>
    </>
  );
}


export default ProjectList;
