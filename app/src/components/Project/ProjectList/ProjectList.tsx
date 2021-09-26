import React, { useContext, useEffect, useRef, useState } from "react";

import "./_project-list.scss";
import { text } from "config";
import { ProjectContext } from "TodoApp";
import { ColorPicker } from "components/ColorPicker/ColorPicker";
import { projectService } from "services/project.service";
import { drawerArray } from "config/drawer-config";
import { ProjectListDropdown } from "components/Project/ProjectList/ProjectListDropdown";
import { createProjectObject } from "functions/create-project-object";
import { IProject, PDefault } from "../../../interfaces";

function validProject(projectId: IProject["id"], projects: IProject[]) {
  const proj = projects.find((p: IProject) => p.id === projectId);
  // If there's a project set in the URL and it's valid (it exists)
  return proj || null; // otherwise don't set any project.
}

interface ProjectListAttrs {
  projectId: IProject["id"];
  changeToProject: (project: IProject) => any;
}
export const ProjectList = ({
  projectId,
  changeToProject,
}: ProjectListAttrs) => {
  const project = useContext(ProjectContext);

  const [isLoading, setIsLoading] = useState("");
  const [projects, setProjects] = useState<IProject[]>([]);

  const [newProjectName, setNewProjectName] = useState("");

  const onFirstLoad = useRef(true);

  useEffect(() => {
    const unsubscribeProjects = projectService.getListOfProjects(
      (_projects: IProject[]) => {
        const _project = validProject(project.id || projectId, _projects);
        if (onFirstLoad.current) {
          _project && changeToProject(_project);
          onFirstLoad.current = false;
        }
        setProjects(_projects);
      }
    );

    return () => {
      unsubscribeProjects && unsubscribeProjects();
    };
  }, []);

  function addNewProject(e: PDefault) {
    e.preventDefault();

    setIsLoading("new");

    projectService
      .newProject(createProjectObject(newProjectName))
      .then((snap) => {
        setNewProjectName("");
        setIsLoading("");
        changeToProject(snap);
      });
  }

  async function deleteProject(_project: IProject) {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(_project.id);
      await projectService.deleteProject(_project);
      changeToProject(null as unknown as IProject);
      setIsLoading("");
    }
  }

  function setProject(_project: IProject) {
    if (_project.id === project.id) {
      changeToProject({ unselected: true } as unknown as IProject); // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    console.info("Changing project from", project.id, "to", _project.id);
    changeToProject(_project);
  }

  async function changeColor(_project: IProject, hexColor: string) {
    return await projectService.updateProject({
      ..._project,
      color: hexColor,
    });
  }

  return (
    <ul className="projects-list flex-column">
      {drawerArray.map((p) => (
        <li
          key={p.url}
          data-tip={p.text.tooltip}
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
