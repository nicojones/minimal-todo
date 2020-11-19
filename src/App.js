import React, { useEffect, useState } from 'react';
import Project from 'components/Project/Project';
import taskService from './services/taskService';
import Loader from 'components/Loader/Loader';
import Projects from './components/Projects/Projects';

export const ProjectContext = React.createContext({});

function App () {

  const [projectKey, setProjectKey] = useState(window.location.hash.substring(1));

  const [project, setProject] = useState({});
  const [showLoader, setShowLoader] = useState(true);


  useEffect(() => {
    window.location.hash = projectKey;

    taskService.getProject(projectKey, (project) => {
      setProject(project);
      setShowLoader(false);
    });

    return () => {
      taskService.db.ref(taskService.path).off('value');
    };
  }, [projectKey]);

  return (
    <>
      { showLoader && <Loader/> }
      <div className="row m0">
        <div className="col s3 projects-list-box">
          <Projects projectKey={ projectKey } setProjectKey={ setProjectKey } setShowLoader={ setShowLoader }/>
        </div>
        <div className="col s9 tasks-list-box flex-column">
          <ProjectContext.Provider value={ { key: project.key, name: project.name } }>
            <Project project={ project }/>
          </ProjectContext.Provider>
        </div>
      </div>
    </>
  );
}

export default App;
