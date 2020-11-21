import React, { useEffect, useState } from 'react';

import taskService from 'services/taskService';
import projectService from 'services/projectService';
import Project from 'components/Project/Project/Project';
import NoProject from 'components/Project/NoProject/NoProject';
import ProjectList from 'components/Project/ProjectList/ProjectList';

export const ProjectContext = React.createContext({});

function TodoApp () {

  const [projectKey, setProjectKey] = useState(window.location.hash.substring(1));

  const [project, setProject] = useState({});
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    window.location.hash = projectKey || '';

    if (projectKey) {

      const unsubscribeProject = projectService.getProject(projectKey, (project) => {
        setProject(project);
      });

      const unsubscribeTasks = taskService.getTasksForProject(projectKey, (project) => {
        setProjectTasks(project);
      });

      return () => {
        unsubscribeProject();
        unsubscribeTasks();
      };
    }
  }, [projectKey]);

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
