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
  projectId: IProject["id"],
  projects: IProject[]
): IProject | null => {
  // @ts-ignore ID must be a string...
  const proj = projects.find((p: IProject) => p.id === +projectId);
  // If there's a project set in the URL and it's valid (it exists)

  if (proj) {
    return proj;
  } else if (reservedKey(projectId)) {
    return { id: projectId } as IProject;
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
  const urlParams = useRef(useParams<{ projectId: string }>());

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
    console.log(urlParams.current.projectId, project.id, tasks);

    // urlParams.current.projectId
    const id = project.id;

    if (!id) {
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
    if (reservedKey(id)) {
      // It's a reserved URL, so we show the Drawer
      setComponent(<Drawer drawerUrl={project.id} tasks={tasks} />);
      return;
    }
    if (id) {
      // We have a project and it has an ID, so it's a user project
      setComponent(<Project tasks={tasks} />);
      return;
    }
    // setComponent(<></>); // either the project hasn't loaded, or isn't valid. we must wait
  }, [project.id, tasks]);

  useEffect(() => {
    reloadProjects();
  }, []);

  const changeToProject = (
    value: Partial<IProject> | null,
    forceProject: Partial<IProject> | null = null
  ): void => {
    if (value && value?.id !== project.id) {
      setProject(value as IProject);
      history.push(urls.project(value.id || ""));
      return;
    } else if (forceProject) {
      setProject(forceProject as unknown as IProject);
    } else {
      history.push(urls.app);
      setProject({ id: null } as unknown as IProject);
    }
  };

  const reloadProjects = (): Promise<IProject[]> => {
    return ProjectService.getListOfProjects().then((_projects: IProject[]) => {
      const _project = validProject(
        project.id || urlParams.current.projectId,
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
    sort: string = project.sort
  ): Promise<ITask[]> => {
    if (!project.id) {
      return Promise.resolve([]);
    }

    return TaskService.getTasksForProject(project.id, sort).then(
      (tasks: ITask[]) => {
        setTasks(tasks);
        return tasks;
      }
    );
  };

  if (!useContext(LoggedInUserContext)) {
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
          showDot: reservedKey(project.id),
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
