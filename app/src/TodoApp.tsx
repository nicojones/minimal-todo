import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { LoggedInUserContext } from "App";
import { AddUserModal } from "components/Modal/AddUserModal";
import { Navbar } from "components/Navbar/Navbar";
import { NoProject } from "components/NoProject/NoProject";
import { Project } from "components/Project/Project";
import { ProjectList } from "components/Project/ProjectList";
import { drawerConfig, text, urls } from "config";
import { reservedKey } from "functions/reserved-key";
import { IProject, IProjectContext, ITask, MinimalProject } from "interfaces";
import { ProjectService, TaskService } from "services";
import { Observable, of, tap } from "rxjs";
import { useAtom } from "jotai";
import { projectAtom, projectsAtom, tasksAtom } from "store";

const validProject = (
  projectSecret: IProject["secret"],
  projects: IProject[]
): MinimalProject | null => {
  // @ts-ignore ID must be a string...
  const proj = projects.find((p: IProject) => p.secret === projectSecret);
  // If there's a project set in the URL and it's valid (it exists)

  if (proj) {
    return proj;
  } else if (reservedKey(projectSecret)) {
    return drawerConfig[projectSecret];
  }
  return null;
};

export const ProjectContext = React.createContext<IProjectContext>({
  changeToProject: () => null,
  reloadProjectTasks: () => of<ITask[]>([]),
  reloadProjects: () => of<IProject[]>([]),
  openAddUserModal: () => null,
});

export const TodoApp = () => {
  const history = useHistory();
  const urlParams = useRef(useParams<{ projectSecret: IProject["secret"] }>());

  const [project, setProject] = useAtom<IProject | null, IProject | null, void>(projectAtom);
  const [, setProjectList] = useAtom<IProject[], IProject[], void>(projectsAtom);
  const [, setTasks] = useAtom<ITask[], ITask[], void>(tasksAtom);
  const [modalOpen, setModalOpen] = useState<IProject | null>(null);

  const [showSidebar, setShowSidebar] = useState(
    !(window as any).isSmallScreen
  );
  const [component, setComponent] = useState(<></>);
  const onFirstLoad = useRef(true);

  useEffect(() => {
    // urlParams.current.projectId
    const secret = project?.secret;

    if (!secret) {
      setComponent(
        <NoProject
          className=""
          setShowSidebar={setShowSidebar}
          addText={text.project.noSelected}
          inspireText={text.project.inspire()}
        />
      ); // no URL -> show this component
      return;
    }
    if (reservedKey(secret)) {
      // It's a reserved URL, so we show the Drawer
      setComponent(<Project specialUrl={secret} />);
      return;
    }
    if (secret) {
      // We have a project and it has an ID, so it's a user project
      setComponent(<Project />);
      return;
    }
  }, [project?.secret]);

  useEffect(() => {
    // load projects when page loads.
    reloadProjects().subscribe();
  }, []);

  const changeToProject = (
    value: MinimalProject | null,
  ): void => {
    console.log("setting value", value)
    if (value && value?.secret !== project?.secret) {
      setProject(value as IProject);
      history.push(urls.project(value?.secret || ""));
      return;
    } else {
      history.push(urls.app);
      setProject(null);
    }
  };

  const reloadProjects = (): Observable<IProject[]> => {
    return ProjectService.getListOfProjects().pipe(
      tap((_projects: IProject[]) => {
        const _project = validProject(
          project?.secret || urlParams.current.projectSecret,
          _projects
        );

        if (onFirstLoad.current) {
          _project && changeToProject(_project);
          onFirstLoad.current = false;
        }
        setProjectList(_projects || []);
      })
    );
  };

  const reloadProjectTasks = (): Observable<ITask[]> => {
    if (!project?.secret) {
      return of<ITask[]>([]);
    }

    return TaskService.getTasksForProject(project.secret).pipe(
      tap((tasks: ITask[]) => {
        setTasks(tasks);
        return tasks;
      })
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
          reloadProjects,
          reloadProjectTasks,
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
              <ProjectList />
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
