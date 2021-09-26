import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";

import { ProjectList } from "components/Project/ProjectList";
import { NoProject } from "components/NoProject/NoProject";
import { text, urls } from "config";
import { Project } from "components/Project/Project";
import { reservedKey } from "functions/reserved-key";
import { Navbar } from "components/Navbar/Navbar";
import { Drawer } from "components/Drawer/Drawer";
import { LoggedInUserContext } from "App";
import { IProject } from "interfaces";

export const ProjectContext = React.createContext<IProject>({} as IProject);
export const ProjectDispatch = React.createContext<
  Dispatch<SetStateAction<Partial<IProject>>>
>({} as unknown as any);

export const TodoApp = () => {
  const history = useHistory();
  const urlParams = useRef(useParams<{ projectId: string }>());

  const [project, setProject] = useState<IProject>({ empty: true } as IProject);
  const [showSidebar, setShowSidebar] = useState(
    !(window as any).isSmallScreen
  );
  const [component, setComponent] = useState(<></>);
  // const [currProject, projectDispatch] = useReducer(changeToProject, project);

  useEffect(() => {
    if (!urlParams.current.projectId) {
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
    if (reservedKey(urlParams.current.projectId)) {
      // It's a reserved URL, so we show the Drawer
      setComponent(<Drawer drawerUrl={urlParams.current.projectId} />);
      return;
    }
    if (project.id) {
      // We have a project and it has an ID, so it's a user project
      setComponent(<Project changeToProject={changeToProject} />);
      return;
    }
    setComponent(<></>); // either the project hasn't loaded, or isn't valid. we must wait
  }, [project.id]);

  function changeToProject(value: IProject) {
    // if (_project.empty) {
    //   return;
    // }
    if (value.id !== project.id) {
      urlParams.current.projectId = value.id || "";
      setProject(value);
      history.push(urls.project(value.id || ""));
    }
  }

  if (!useContext(LoggedInUserContext)) {
    history.push(urls.login); // and in some cases go to the login
    return null;
  }

  return (
    <>
      {/* @ts-ignore */}
      <ProjectDispatch.Provider value={changeToProject}>
        <ProjectContext.Provider value={project}>
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
                <ProjectList
                  projectId={urlParams.current.projectId}
                  changeToProject={changeToProject}
                />
              </div>
            </div>
            <div className="tasks-list-box flex-column">{component}</div>
          </div>
        </ProjectContext.Provider>
      </ProjectDispatch.Provider>
    </>
  );
}
