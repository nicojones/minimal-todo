import { useContext, useState } from "react";

import { ProjectContext } from "TodoApp";
import { ColorPicker } from "components/ColorPicker/ColorPicker";
import { ProjectListDropdown } from "components/Project/ProjectList/ProjectListDropdown";
import { text } from "config";
import { drawerArray } from "config/drawer-config";
import { createProjectObject } from "functions/create-project-object";
import { ProjectService } from "services/project.service";
import { IProject, IProjectContext, PDefault, PbItem } from "../../../interfaces";
import "./_project-list.scss";
import { reservedKey } from "functions/reserved-key";



interface ProjectListAttrs {
  projectId: IProject["id"];
  projects: IProject[];
}

export const ProjectList = (
  { projectId, projects }: ProjectListAttrs
) => {
  const { project, changeToProject, reloadProjects, reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  const [isLoading, setIsLoading] = useState("");

  const [newProjectName, setNewProjectName] = useState("");

  const addNewProject = (e: PDefault): void => {
    e.preventDefault();

    setIsLoading("new");

    ProjectService
      .newProject(createProjectObject(newProjectName))
      .then((project: IProject | void) => {
        setNewProjectName("");
        setIsLoading("");
        changeToProject(project as unknown as IProject);
        reloadProjects();
      });
  }

  const deleteProject = (_project: IProject): Promise<void> | void => {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(_project.id);
      return ProjectService.deleteProject(_project)
        .then(() => {
          changeToProject(null);
          setIsLoading("");
          reloadProjects();
        });
    }
  }

  const setProject = (_project: IProject): void => {
    if (_project.id === project.id) {
      changeToProject({ unselected: true } as unknown as IProject); // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    console.info("Changing project from", project.id, "to", _project.id);
    changeToProject(_project);
  }

  const changeColor = (_project: IProject, hexColor: string): Promise<IProject | void> => {
    return ProjectService.updateProject({
      ..._project,
      color: hexColor,
    })
    .then(() => {
      reloadProjects();
      if (reservedKey(project.id)) {
        reloadProjectTasks();
      }
    });
  }

  return (
    <ul className="projects-list flex-column">
      {drawerArray.map((p) => (
        <li
          key={p.url}
          title={p.text.tooltip}
          className={
            "proj-li mb-5 parent-hover flex-row" +
            (projectId === p.url ? " selected" : "")
          }
        >
          <button
            className="ib left left-align w-100"
            onClick={() => setProject({ id: p.url } as IProject)}
          >
            <i className="material-icons tiny left btn-pr">{p.icon}</i>
            <span className="btn-pl">{p.text._}</span>
          </button>
        </li>
      ))}
      {projects.length ? (
        <li key="title" className="proj-li bt-subtle">
          <i className="material-icons inv">inbox</i>
          <span className="btn-pl subtle">{text.project.s}</span>
        </li>
      ) : (
        ""
      )}
      {projects.map((proj) => (
        <li
          key={proj.id}
          className={
            "proj-li mb-5 parent-hover flex-row" +
            (project.id === proj.id ? " selected" : "") +
            (isLoading === proj.id ? " loader-input" : "")
          }
        >
          <ColorPicker
            color={proj.color}
            onChangeComplete={(e) => changeColor(proj, e)}
            title={proj.shared ? text.sharedProject._ : ""}
            icon={proj.shared ? "person" : "lens"}
          />
          <button
            className="ib left left-align btn-p w-100"
            onClick={() => setProject(proj)}
          >
            {proj.name}
            {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/}
          </button>
          <ProjectListDropdown project={proj} onDelete={deleteProject} />
        </li>
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
