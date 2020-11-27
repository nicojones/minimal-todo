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
import drawerService from './services/drawerService';
import Drawer from './components/Drawer/Drawer';
import reservedKey from './functions/reservedKey';

export const ProjectContext = React.createContext({});


function TodoApp () {
  const history = useHistory();
  const { projectKeyParam } = useParams();

  const [projectKey, setProjectKey] = useState(projectKeyParam || '');
  const [project, setProject] = useState({});
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  useEffect(() => {
    if (projectKey !== String(projectKeyParam)) {
      history.push(urls.project(projectKey));
    }
  }, [ projectKey ]);


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
          <ProjectContext.Provider value={ project }>
            {
              projectKey
                ? (
                  reservedKey(projectKey)
                    ? <Drawer projectKey={ projectKey } />
                    : <Project projectKey={ projectKey } project={ project } setProject={ setProject }/>
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
