import React, { useEffect, useState } from 'react';
import taskService from 'services/taskService';
import { text } from 'text';
import './_projects.scss';

function validProjectKey (key, projects) {
  if (!key || !projects.filter((p) => p.key === key).length) {
    return projects[0].key;
  }
  return key;
}

function Projects ({ projectKey, setProjectKey, setShowLoader }) {

  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    taskService.getProjects((_projects) => {
      setProjectKey(validProjectKey(projectKey, _projects)); // set the first project as selected...
      setProjects(_projects);
    });
  }, [projectKey]);

  // }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  function addNewProject (e) {
    e.preventDefault();

    taskService.newProject(newProjectName).then((snap) => {
      setShowAddProject(false);
      setNewProjectName('');
      setProjectKey(snap.key);
    });
  }

  async function deleteProject (project) {
    if (window.confirm(text.deleteProject)) {
      setShowLoader(true);
      setProjectKey('');
      await taskService.deleteProject(project);
    }
  }

  function setProject (project) {
    if (project.key === projectKey) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    // setShowLoader(true);
    setProjectKey(project.key);
  }

  return (
    <>
      <h4>{ text.projects }</h4>
      <ul className="projects-list flex-column">
        {
          projects.map((proj) =>
            <li key={ proj.key } className={ (projectKey === proj.key ? 'selected' : '') + ' mb-5 parent-hover ' }>
              <button className="btn-invisible left" onClick={ () => setProject(proj) }>
                { proj.name } ( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )
              </button>
              <button className="btn-invisible child-hover left" onClick={ () => deleteProject(proj) }>
                <i className="tiny material-icons subtle">delete</i>
              </button>
            </li>
          )
        }
        <li>
          {
            showAddProject
              ? <form onSubmit={ addNewProject }>
                <input
                  className="invisible subtle" onChange={ (e) => setNewProjectName(e.target.value) }
                  required minLength="3"
                  value={ newProjectName } autoFocus placeholder={ text.addProjectPh }
                  onBlur={ () => setShowAddProject(false) }
                />
              </form>
              : <button className="btn-invisible btn-flat subtle" onClick={ () => setShowAddProject(true) }>
                <i className="material-icons left tiny">add</i>{ text.addProject }
              </button>
          }
        </li>
      </ul>
    </>
  );
}

export default Projects;
