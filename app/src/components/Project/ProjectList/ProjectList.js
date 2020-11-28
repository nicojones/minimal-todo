import React, { useEffect, useState } from 'react';
import { text } from 'config/text';
import './_project-list.scss';
import projectService from 'services/projectService';
import ProjectListDropdown from './ProjectListDropdown';
import cogoToast from 'cogo-toast';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import { urls } from 'config/urls';
import createProjectObject from 'functions/createProjectObject';

function validProject (projectId, projects) {
  const proj = projects.find((p) => p.id === projectId);
  // If there's a project set in the URL and it's valid (it exists)
  return proj || null; // otherwise don't set any project.
}

function ProjectList ({ projectId, project, changeToProject }) {

  const [isLoading, setIsLoading] = useState('');
  const [projects, setProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const unsubscribeProjects = projectService.getListOfProjects((_projects) => {
      const _project = validProject(project.id || projectId, _projects);
      _project && changeToProject(_project);
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
      .newProject(createProjectObject(newProjectName))
      .then((snap) => {
        setNewProjectName('');
        setIsLoading('');
        changeToProject(snap.id);
      });
  }

  async function deleteProject (project) {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(project.id);
      await projectService.deleteProject(project);
      changeToProject('');
      setIsLoading('');
    }
  }

  function setProject (_project) {
    console.log(project, _project);
    if (_project.id === project.id) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    changeToProject(_project);
  }

  async function changeColor (project, hexColor) {
    return await projectService.updateProject({
      ...project,
      color: hexColor
    });
  }

  return (
    <>
      <h5 className="center-align">{ text.project.s }</h5>
      <ul className="projects-list flex-column">
        <li key={ urls.inboxUrl } className={ 'ml-50 mb-5 parent-hover flex-row' + (project.id === urls.inboxUrl ? ' selected' : '') }>
          <button className="btn-invisible left left-align ps-6" onClick={ () => setProject({ id: urls.inboxUrl }) }>{ text.drawer.inbox._ }</button>
        </li>
        {
          projects.map((proj) =>
            <li
              key={ proj.id }
              className={ 'mb-5 parent-hover flex-row' + (project.id === proj.id ? ' selected' : '') + (isLoading === proj.id ? ' loader-input' : '') }
            >
              <ProjectListDropdown project={ proj }/>
              <ColorPicker color={ proj.color } onChangeComplete={ (e) => changeColor(proj, e) } />
              <button className="btn-invisible left left-align ps-6" onClick={ () => setProject(proj) }>
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
