import React, { useEffect, useState } from 'react';

import './_project-list.scss';
import { urls } from 'config/urls';
import { text } from 'config/text';
import projectService from 'services/projectService';
import ProjectListDropdown from './ProjectListDropdown';
import ColorPicker from 'components/ColorPicker/ColorPicker';
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
    if (_project.id === project.id) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    console.info('Changing project from', project.id, 'to', _project.id);
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
        <li key={ urls.inboxUrl } className={ 'proj-li mb-5 parent-hover flex-row' + (project.id === urls.inboxUrl ? ' selected' : '') }>
          <button className="btn-invisible left left-align" onClick={ () => setProject({ id: urls.inboxUrl }) }>
            <i className="material-icons tiny left btn-pr">inbox</i>
            <span className="btn-pl">{ text.drawer.inbox._ }</span>
          </button>
        </li>
        {
          projects.map((proj) =>
            <li
              key={ proj.id }
              className={ 'proj-li mb-5 parent-hover flex-row' + (project.id === proj.id ? ' selected' : '') + (isLoading === proj.id ? ' loader-input' : '') }
            >
              <ColorPicker color={ proj.color } onChangeComplete={ (e) => changeColor(proj, e) } icon={ proj.shared ? 'person' : 'lens' } />
              <button className="btn-invisible left left-align btn-p" onClick={ () => setProject(proj) }>
                { proj.name }
                {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/ }
              </button>
              <ProjectListDropdown project={ proj }/>
            </li>
          )
        }
        <li key="new-project" className="proj-li mb-5 parent-hover flex-row">
          <button className="btn-invisible child-hover ch-hidden left">
            <label htmlFor="new-project-input" className="pointer">
              <i className="tiny material-icons subtle">add</i>
            </label>
          </button>
          <form
            onSubmit={ addNewProject }
            className={ 'add-project flex-row w-100' + (isLoading === 'new' ? ' loader-input' : '') }
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
