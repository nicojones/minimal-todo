import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { urls } from 'config/urls';
import { LoggedInUserContext } from 'App';

import Navbar from 'components/Navbar/Navbar';
import Project from 'components/Project/Project';
import NoProject from 'components/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList';
import Drawer from './components/Drawer/Drawer';
import reservedKey from './functions/reservedKey';

export const ProjectContext = React.createContext({});

function TodoApp () {
  const history = useHistory();
  const { projectKeyParam: projectId } = useParams();

  const [project, setProject] = useState({empty: true});
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  function changeToProject (_project) {
    if (_project.id !== project.id) {
      setProject(_project);
      history.push(urls.project(_project.id || ''));
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
        <ProjectContext.Provider value={ project }>
          <div className={ 'projects-list-box' }>
            { showSidebar ? <div className="backdrop dark only-mobile" onClick={ () => setShowSidebar(false) }/> : '' }
            <div className={ 'projects-list-box-inner' }>
              <ProjectList
                projectId={ projectId }
                changeToProject={ changeToProject }
              />
            </div>
          </div>
          <div className="tasks-list-box flex-column">
            {
              project.id
                ? (
                  reservedKey(project.id)
                    ? <Drawer drawerUrl={ project.id }/>
                    : <Project/>
                )
                : <NoProject setShowSidebar={ setShowSidebar }/>
            }
          </div>
        </ProjectContext.Provider>
      </div>
    </>
  );
}

export default TodoApp;
