import React, { useEffect, useState } from 'react';
import { text } from 'text';
import './_project-list.scss';
import projectService from 'services/projectService';

function validProjectId (id, projects) {
  if (!id || !projects.filter((p) => p.id === id).length) {
    return projects.length ? projects[0].id : '';
  }
  return id;
}

function ProjectList ({ projectKey, setProjectKey }) {

  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const unsubscribeProjects = projectService.getListOfProjects((_projects) => {
      setProjectKey(validProjectId(projectKey, _projects)); // set the first project as selected...
      setProjects(_projects);
    });

    return () => {
      unsubscribeProjects();
    };
  }, [projectKey]);

  // }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  function addNewProject (e) {
    e.preventDefault();

    projectService
      .newProject({ name: newProjectName })
      .then((snap) => {
        setShowAddProject(false);
        setNewProjectName('');
        setProjectKey(snap.id);
      });
  }

  async function deleteProject (project) {
    if (window.confirm(text.deleteProject)) {
      setProjectKey('');
      await projectService.deleteProject(project);
    }
  }

  function setProject (project) {
    if (project.id === projectKey) {
      return; // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    setProjectKey(project.id);
  }

  return (
    <>
      <h4>{ text.projects }</h4>
      <ul className="projects-list flex-column">
        {
          projects.map((proj) =>
            <li key={ proj.id } className={ (projectKey === proj.id ? 'selected' : '') + ' mb-5 parent-hover ' }>
              <button className="btn-invisible left" onClick={ () => setProject(proj) }>
                { proj.name }
                {
                  proj.shared &&
                  <i
                    className="tiny material-icons subtle left m0"
                    title={ text.sharedProject }
                  >people_outline</i>
                }
                {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/ }
              </button>
              <button className="btn-invisible child-hover left" onClick={ () => deleteProject(proj) }>
                <i className="tiny material-icons subtle">delete</i>
              </button>

            </li>
          )
        }
        <li key="new-project">
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


export default ProjectList;
