import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { urls } from 'config/urls';
import { LoggedInUserContext } from 'App';

import Navbar from 'components/Navbar/Navbar';
import Project from 'components/Project/Project';
import NoProject from 'components/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList';
import Drawer from './components/Drawer/Drawer';
import reservedKey from './functions/reservedKey';
import { text } from './config/text';

export const ProjectContext = React.createContext({});
export const ProjectDispatch = React.createContext({});

function TodoApp () {
  const history = useHistory();
  const urlParams = useRef(useParams());

  const [project, setProject] = useState({ empty: true });
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);
  const [component, setComponent] = useState(<></>);
  // const [currProject, projectDispatch] = useReducer(changeToProject, project);

  useEffect(() => {
    if (!urlParams.current.projectId) { // There's some URL?
      setComponent(<NoProject setShowSidebar={ setShowSidebar } addText={text.project.noSelected}
        inspireText={ text.project.inspire }/>); // no URL -> show this component
      return;
    }
    if (reservedKey(urlParams.current.projectId)) { // It's a reserved URL, so we show the Drawer
      setComponent(<Drawer drawerUrl={ urlParams.current.projectId }/>);
      return;
    }
    if (project.id) { // We have a project and it has an ID, so it's a user project
      setComponent(<Project setProject={ changeToProject }/>);
      return;
    }
    setComponent(<></>); // either the project hasn't loaded, or isn't valid. we must wait
  }, [project.id]);

  function changeToProject (_project) {
    // if (_project.empty) {
    //   return;
    // }
    if (_project.id !== project.id) {
      urlParams.current.projectId = _project.id || '';
      setProject(_project);
      history.push(urls.project(_project.id || ''));
    }
  }

  if (!React.useContext(LoggedInUserContext)) {
    history.push(urls.login); // and in some cases go to the login
    return null;
  }

  return (
    <>
      <ProjectDispatch.Provider value={ changeToProject }>
        <ProjectContext.Provider value={ project }>
          <Navbar setShowSidebar={ setShowSidebar } showSidebar={ showSidebar }/>
          <div id="todo-app" className={ (showSidebar ? '' : ' hidden-bar') }>
            <div className={ 'projects-list-box' }>
              { showSidebar ?
                <div className="backdrop dark only-mobile" onClick={ () => setShowSidebar(false) }/> : '' }
              <div className={ 'projects-list-box-inner' }>
                <ProjectList
                  projectId={ urlParams.current.projectId }
                  changeToProject={ changeToProject }
                />
              </div>
            </div>
            <div className="tasks-list-box flex-column">
              { component }
            </div>
          </div>
        </ProjectContext.Provider>
      </ProjectDispatch.Provider>
    </>
  );
}

export default TodoApp;
