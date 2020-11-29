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

  const [project, setProject] = useState({});
  const [showSidebar, setShowSidebar] = useState(!window.isSmallScreen);

  function changeToProject (_project) {
    console.log('somehow it changes project here i guess...', project.id, ' will change to: ', _project.id);
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
        <div className={ 'projects-list-box' }>
          { showSidebar ? <div className="backdrop only-mobile" onClick={ () => setShowSidebar(false) }/> : '' }
          <div className={ 'projects-list-box-inner' }>
            <ProjectList
              projectId={ projectId }
              project={ project }
              changeToProject={ changeToProject }
            />
          </div>
        </div>
        <div className="tasks-list-box flex-column">
          <ProjectContext.Provider value={ project }>
            {
              project.id
                ? (
                  reservedKey(project.id)
                    ? <Drawer drawerUrl={ project.id }/>
                    : <Project/>
                )
                : <NoProject setShowSidebar={ setShowSidebar }/>
            }
          </ProjectContext.Provider>
        </div>
      </div>
    </>
  );
}

export default TodoApp;
