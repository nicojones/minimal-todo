import React, { useEffect, useState } from 'react';

import taskService from 'services/taskService';
import projectService from 'services/projectService';
import Project from 'components/Project/Project/Project';
import NoProject from 'components/Project/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList/ProjectList';
import { useHistory, useParams } from 'react-router-dom';
import { LoggedInUserContext } from 'App';
import { urls } from 'config/urls';

export const ProjectContext = React.createContext({});


function TodoApp () {
  const history = useHistory();
  const { projectKeyParam } = useParams();

  const [projectKey, setProjectKey] = useState(projectKeyParam || '');
  const [project, setProject] = useState({});
  const [projectTasks, setProjectTasks] = useState([]);
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  useEffect(() => {

    if (projectKey !== String(projectKeyParam)) {
      history.push(urls.project(projectKey));
    }

    if (projectKey) {

      const unsubscribeProject = projectService.getProject(projectKey, (project) => {
        setProject(project);
      });

      const unsubscribeTasks = taskService.getTasksForProject(projectKey, (project) => {
        setProjectTasks(project);
      });

      return () => {
        unsubscribeProject && unsubscribeProject();
        unsubscribeTasks && unsubscribeTasks();
      };
    }
  }, [projectKey]);

  if (!React.useContext(LoggedInUserContext)) {
    history.push(urls.login);
    return null;
  }

  return (
    <>
      <div className="navbar-fixed">
        <nav className="grey">
          <div className="nav-wrapper">
            <a className="sidenav-triggert btn-subtle" onClick={ () => setShowSidebar(!showSidebar) }>
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">Javascript</a></li>
              <li><a href="mobile.html">Mobile</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div id="todo-app" className={ (showSidebar ? '' : ' hidden-bar') }>
        <div className={ 'projects-list-box' }>
          <div className={ 'projects-list-box-inner' }>
            <ProjectList
              projectKey={ projectKey }
              setProjectKey={ setProjectKey }
            />
          </div>
        </div>
        <div className="tasks-list-box flex-column">
          <ProjectContext.Provider
            value={ {
              id: project.id,
              name: project.name
            } }
          >
            {
              projectKey
                ? <Project project={ project } projectTasks={ projectTasks }/>
                : <NoProject setShowSidebar={ setShowSidebar }/>
            }
          </ProjectContext.Provider>
        </div>
        <i/> { /* Thanks to this, we have three elements. Space-between works like a charm */ }
      </div>
    </>
  );
}

export default TodoApp;
