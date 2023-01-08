import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { LoggedInUserContext } from "App";
import { Drawer } from "components/Drawer/Drawer";
import { Navbar } from "components/Navbar/Navbar";
import { NoProject } from "components/NoProject/NoProject";
import { Project } from "components/Project/Project";
import { ProjectList } from "components/Project/ProjectList";
import { text, urls } from "config";
import { reservedKey } from "functions/reserved-key";
import { IProject, IProjectContext, ITask } from "interfaces";
import { ProjectService, TaskService } from "services";
import { AddUserModal } from "components/Modal/AddUserModal";

const validProject = (
  projectSecret: IProject["secret"],
  projects: IProject[]
): IProject | null => {
  // @ts-ignore ID must be a string...
  const proj = projects.find((p: IProject) => p.secret === projectSecret);
  // If there's a project set in the URL and it's valid (it exists)

  if (proj) {
    return proj;
  } else if (reservedKey(projectSecret)) {
    return { secret: projectSecret } as IProject;
  }
  return null;
};

export const ProjectContext = React.createContext<IProjectContext>({
  project: {} as IProject,
  changeToProject: () => null,
  setProject: () => null,
  showDot: false,
  reloadProjectTasks: null as unknown as () => Promise<ITask[]>,
  reloadProjects: () => null as unknown as Promise<IProject[]>,
  openAddUserModal: () => null,
});

export const TodoApp = () => {
  const history = useHistory();
  const urlParams = useRef(useParams<{ projectSecret: IProject["secret"] }>());

  const [project, setProject] = useState<IProject>({ empty: true } as IProject);
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [modalOpen, setModalOpen] = useState<IProject | null>(null);

  const [showSidebar, setShowSidebar] = useState(
    !(window as any).isSmallScreen
  );
  const [component, setComponent] = useState(<></>);
  const onFirstLoad = useRef(true);

  useEffect(() => {

    // urlParams.current.projectId
    const secret = project.secret;

    if (!secret) {
      // There's some URL?
      setComponent(
        <NoProject
          className=""
          setShowSidebar={setShowSidebar}
          addText={text.project.noSelected}
          inspireText={text.project.inspire}
        />
      ); // no URL -> show this component
      return;
    }
    if (reservedKey(secret)) {
      // It's a reserved URL, so we show the Drawer
      setComponent(<Drawer drawerUrl={secret} tasks={tasks} />);
      return;
    }
    if (secret) {
      // We have a project and it has an ID, so it's a user project
      setComponent(<Project tasks={tasks} />);
      return;
    }
    // setComponent(<></>); // either the project hasn't loaded, or isn't valid. we must wait
  }, [project.secret, tasks]);

  useEffect(() => {
    reloadProjects();
  }, []);

  const changeToProject = (
    value: Partial<IProject> | null,
    forceProject: Partial<IProject> | null = null
  ): void => {
    if (value && value?.secret !== project.secret) {
      setProject(value as IProject);
      history.push(urls.project(value?.secret || ""));
      return;
    } else if (forceProject) {
      setProject(forceProject as unknown as IProject);
    } else {
      history.push(urls.app);
      setProject({ secret: null } as unknown as IProject);
    }
  };

  const reloadProjects = (): Promise<IProject[]> => {
    return ProjectService.getListOfProjects().then((_projects: IProject[]) => {
      const _project = validProject(
        project.secret || urlParams.current.projectSecret,
        _projects
      );

      if (onFirstLoad.current) {
        _project && changeToProject(_project);
        onFirstLoad.current = false;
      }
      setProjectList(_projects || []);

      return _projects;
    });
  };

  const reloadProjectTasks = (
  ): Promise<ITask[]> => {
    if (!project.secret) {
      return Promise.resolve([]);
    }

    return TaskService.getTasksForProject(project.secret).then(
      (tasks: ITask[]) => {
        setTasks(tasks);
        return tasks;
      }
    );
  };

  if (!useContext(LoggedInUserContext).user) {
    history.push(urls.login); // and in some cases go to the login
    return null;
  }

  return (
    <>
      <ProjectContext.Provider
        value={{
          changeToProject,
          project,
          reloadProjects,
          showDot: reservedKey(project.secret),
          reloadProjectTasks,
          setProject,
          openAddUserModal: setModalOpen,
        }}
      >
        <Navbar setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
        <div id="todo-app" className={showSidebar ? "" : " hidden-bar"}>
          <div className={"projects-list-box"}>
            {showSidebar ? (
              <div
                className="backdrop dark only-mobile"
                onClick={() => setShowSidebar(false)}
              />
            ) : (
              ""
            )}
            <div className={"projects-list-box-inner"}>
              <ProjectList projects={projectList} projectId={project?.id} />
            </div>
          </div>
          <div className="tasks-list-box flex-column">{component}</div>
        </div>
        {modalOpen ? (
          <AddUserModal
            project={project}
            modalProject={modalOpen}
            setModalProject={setModalOpen}
          />
        ) : null}
      </ProjectContext.Provider>
    </>
  );
};
