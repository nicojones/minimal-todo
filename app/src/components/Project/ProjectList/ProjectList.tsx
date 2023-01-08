import { useContext, useState } from "react";

import { ProjectContext } from "TodoApp";
import { text } from "config";
import { drawerArray } from "config/drawer-config";
import { createProjectObject } from "functions/create-project-object";
import { ProjectService } from "services/project.service";
import {
  IProject,
  IProjectContext,
  MinimalProject,
  PDefault,
} from "../../../interfaces";
import { ProjectListItem } from "./ProjectListItem";
import "./_project-list.scss";

interface ProjectListAttrs {
  projectId: IProject["id"];
  projects: IProject[];
}

export const ProjectList = ({ projectId, projects }: ProjectListAttrs) => {
  const { project, changeToProject, reloadProjects, reloadProjectTasks } =
    useContext<IProjectContext>(ProjectContext);

  const [isLoading, setIsLoading] = useState<"" | "new" | IProject["secret"]>(
    ""
  );

  const [newProjectName, setNewProjectName] = useState("");

  const addNewProject = (e: PDefault): void => {
    e.preventDefault();

    setIsLoading("new");

    ProjectService.newProject(createProjectObject(newProjectName)).then(
      (project: IProject | void) => {
        setNewProjectName("");
        setIsLoading("");
        changeToProject(project as unknown as IProject);
        reloadProjects();
      }
    );
  };

  const deleteProject = (_project: IProject): Promise<void> | void => {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(_project.secret);
      return ProjectService.deleteProject(_project).then(() => {
        changeToProject(null);
        setIsLoading("");
        reloadProjects();
      });
    }
  };

  const setProject = (_project: IProject): void => {
    if (_project.secret === project.secret) {
      changeToProject({ unselected: true } as unknown as IProject); // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    console.info(
      "Changing project from",
      project.secret,
      "to",
      _project.secret
    );
    changeToProject(_project);
  };

  return (
    <ul className="projects-list flex-column">
      {drawerArray.map((p: MinimalProject) => (
        <ProjectListItem
          key={p.secret}
          isLoading={""}
          deleteProject={() => null}
          project={p}
          setProject={setProject}
          isSpecialProject={true}
        />
      ))}
      {projects.length ? (
        <li key="title" className="proj-li bt-subtle">
          <i className="material-icons inv">inbox</i>
          <span className="btn-pl subtle">{text.project.s}</span>
        </li>
      ) : (
        ""
      )}
      {projects.map((proj: MinimalProject) => (
        <ProjectListItem
          key={proj.secret}
          project={proj}
          setProject={setProject}
          isLoading={isLoading}
          deleteProject={deleteProject}
          isSpecialProject={false}
        />
      ))}
      <li key="new-project" className="proj-li mb-5 parent-hover flex-row">
        <form
          onSubmit={addNewProject}
          className={
            "add-project flex-row " +
            (isLoading === "new" ? " loader-input" : "")
          }
        >
          <button className="ib child-hover left">
            <label htmlFor="new-project-input" className="pointer">
              <i className="tiny material-icons subtle">
                {newProjectName ? "save" : "add"}
              </i>
            </label>
          </button>
          <input
            className="invisible add-project__input btn-pl"
            onChange={(e) => setNewProjectName(e.target.value)}
            required
            minLength={3}
            disabled={isLoading === "new"}
            autoComplete="off"
            value={newProjectName}
            id="new-project-input"
            placeholder={text.project.add.ph}
          />
        </form>
      </li>
    </ul>
  );
};
