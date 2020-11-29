import React, { useContext, useEffect, useRef, useState } from 'react';

import './_project-list.scss';
import { text } from 'config/text';
import projectService from 'services/projectService';
import ProjectListDropdown from './ProjectListDropdown';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import createProjectObject from 'functions/createProjectObject';
import { drawerArray } from 'config/drawerConfig';
import { ProjectContext } from 'TodoApp';

function validProject (projectId, projects) {
  const proj = projects.find((p) => p.id === projectId);
  // If there's a project set in the URL and it's valid (it exists)
  return proj || null; // otherwise don't set any project.
}

function ProjectList ({ projectId, changeToProject }) {

  const project = useContext(ProjectContext);

  const [isLoading, setIsLoading] = useState('');
  const [projects, setProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');

  const onFirstLoad = useRef(true);

  useEffect(() => {
    console.log('redoing it now')
    const unsubscribeProjects = projectService.getListOfProjects((_projects) => {
      const _project = validProject(project.id || projectId, _projects);
      if (onFirstLoad.current) {
        _project && changeToProject(_project);
        onFirstLoad.current = false;
      }
      setProjects(_projects);
    });

    return () => {
      unsubscribeProjects && unsubscribeProjects();
    };
  }, []);

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

  async function deleteProject (_project) {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(_project.id);
      await projectService.deleteProject(_project);
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

  async function changeColor (_project, hexColor) {
    return await projectService.updateProject({
      ..._project,
      color: hexColor
    });
  }


  return (
    <>
      <ul className="projects-list flex-column">
        {
          drawerArray.map((p) => <li
            key={ p.url }
            title={ p.text.tooltip }
            className={ 'proj-li mb-5 parent-hover flex-row' + (projectId === p.url ? ' selected' : '') }
          >
            <button className="btn-invisible left left-align" onClick={ () => setProject({ id: p.url }) }>
              <i className="material-icons tiny left btn-pr">{ p.icon }</i>
              <span className="btn-pl">{ p.text._ }</span>
            </button>
          </li>)
        }
        { projects.length ?
          <li key="title" className="proj-li mb-5 bt-subtle">
            <i className="material-icons inv">inbox</i>
            <span className="btn-pl subtle">{ text.project.s }</span>
          </li> : '' }
        {
          projects.map((proj) =>
            <li
              key={ proj.id }
              className={ 'proj-li mb-5 parent-hover flex-row' + (project.id === proj.id ? ' selected' : '') + (isLoading === proj.id ? ' loader-input' : '') }
            >
              <ColorPicker
                color={ proj.color } onChangeComplete={ (e) => changeColor(proj, e) }
                icon={ proj.shared ? 'person' : 'lens' }
              />
              <button className="btn-invisible left left-align btn-p" onClick={ () => setProject(proj) }>
                { proj.name }
                {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/ }
              </button>
              <ProjectListDropdown project={ proj } onDelete={ deleteProject }/>
            </li>
          )
        }
        <li key="new-project" className="proj-li mb-5 parent-hover flex-row">
          <form
            onSubmit={ addNewProject }
            className={ 'add-project flex-row w-100 p0 ' + (isLoading === 'new' ? ' loader-input' : '') }
          >
            <button className="btn-invisible child-hover ch-hidden left">
              <label htmlFor="new-project-input" className="pointer">
                <i className="tiny material-icons subtle">{ newProjectName ? 'save' : 'add' }</i>
              </label>
            </button>
            <input
              className="invisible left-align btn-pl"
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
