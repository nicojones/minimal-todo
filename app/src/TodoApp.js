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
      <div className="row m0 w-100">
        <div className="col s3 projects-list-box">
          <ProjectList
            projectKey={ projectKey }
            setProjectKey={ setProjectKey }
          />
        </div>
        <div className="col s9 tasks-list-box flex-column">
          <ProjectContext.Provider
            value={ {
              id: project.id,
              name: project.name
            } }
          >
            {
              projectKey
                ? <Project project={ project } projectTasks={ projectTasks }/>
                : <NoProject/>
            }
          </ProjectContext.Provider>
        </div>
      </div>
    </>
  );
}

export default TodoApp;
