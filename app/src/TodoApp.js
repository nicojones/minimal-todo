import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { urls } from 'config/urls';
import { LoggedInUserContext } from 'App';

import Navbar from 'components/Navbar/Navbar';
import Project from 'components/Project/Project/Project';
import NoProject from 'components/Project/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList/ProjectList';
import Drawer from './components/Drawer/Drawer';
import reservedKey from './functions/reservedKey';

export const ProjectContext = React.createContext({});


function TodoApp () {
  const history = useHistory();
  const { projectKeyParam: projectIdParam } = useParams();

  const [projectId, setProjectId] = useState(projectIdParam || '');
  const [project, setProject] = useState({});
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  function changeToProject (_projectId) {
    if (_projectId !== projectId) {
      setProjectId(_projectId);
      history.push(urls.project(_projectId));
    }
  }

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
              projectId={ projectId }
              changeToProject={ changeToProject }
            />
          </div>
        </div>
        <div className="tasks-list-box flex-column">
          <ProjectContext.Provider value={ project }>
            {
              projectId
                ? (
                  reservedKey(projectId)
                    ? <Drawer projectKey={ projectId }/>
                    : <Project projectKey={ projectId } project={ project } setProject={ setProject }/>
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
