import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { urls } from 'config/urls';
import { LoggedInUserContext } from 'App';

import taskService from 'services/taskService';

import Navbar from 'components/Navbar/Navbar';
import projectService from 'services/projectService';
import Project from 'components/Project/Project/Project';
import NoProject from 'components/Project/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList/ProjectList';
import reservedKey from './functions/reservedKey';
import drawerService from './services/drawerService';

export const ProjectContext = React.createContext({});


function TodoApp () {
  const history = useHistory();
  const { projectKeyParam } = useParams();

  const [projectKey, setProjectKey] = useState(projectKeyParam || '');
  const [project, setProject] = useState({});
  const [projectTasks, setProjectTasks] = useState([]);
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  useEffect(() => {

    console.log(projectKey, String(projectKeyParam));
    if (projectKey !== String(projectKeyParam)) {
      history.push(urls.project(projectKey));
    }

    if (projectKey) {

      // console.log(reservedKey(projectKey), projectKey)
      // if (reservedKey(projectKey)) {
      //   // Special project, like an inbox...
      //   const unsubscribeProject = drawerService.getDrawer(projectKey, setProject);
      //   return () => {
      //     unsubscribeProject && unsubscribeProject();
      //   };
      //
      // } else { // NORMAL project
        const unsubscribeProject = projectService.getProject(projectKey, setProject);
        const unsubscribeTasks = taskService.getTasksForProject(projectKey, setProjectTasks);

        return () => {
          unsubscribeProject && unsubscribeProject();
          unsubscribeTasks && unsubscribeTasks();
        };
      // }
    }
  }, [projectKey]);

  if (!React.useContext(LoggedInUserContext)) {
    history.push(urls.login);
    return null;
  }

  return (
    <>
      <Navbar setShowSidebar={ setShowSidebar } showSidebar={ showSidebar }/>
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
              color: project.color,
              showCompleted: project.showCompleted,
              name: project.name
            } }
          >
            {
              projectKey
                ? (
                  // reservedKey(projectKey)
                  //   ? <Drawer project={ project } projectTasks={ projectTasks }/>
                  <Project project={ project } projectTasks={ projectTasks }/>
                )
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
