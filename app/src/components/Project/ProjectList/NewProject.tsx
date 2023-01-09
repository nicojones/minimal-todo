import { ProjectContext } from "TodoApp";
import { text } from "config";
import { createProjectObject } from "functions/create-project-object";
import { PDefault, IProject, IProjectContext } from "interfaces";
import { SetStateAction } from "jotai";
import { Dispatch, useContext, useState } from "react";
import { switchMap } from "rxjs";
import { ProjectService } from "services";

interface NewProjectAttrs {
  isLoading: "" | "new" | IProject["secret"];
  setIsLoading: Dispatch<SetStateAction<"" | "new" | IProject["secret"]>>;
}

export const NewProject = ({isLoading, setIsLoading}: NewProjectAttrs) => {

  const { changeToProject, reloadProjects } =
    useContext<IProjectContext>(ProjectContext);

  const [newProjectName, setNewProjectName] = useState("");

  const addNewProject = (e: PDefault): void => {
    e.preventDefault();

    setIsLoading("new");

    ProjectService.newProject(createProjectObject(newProjectName)).pipe(
      switchMap((project: IProject | void) => {
        setNewProjectName("");
        setIsLoading("");
        changeToProject(project as unknown as IProject);
        return reloadProjects();
      })
    ).subscribe();
  };
  
  return (
    <li key="new-project" className="proj-li mb-5 parent-hover flex-row">
      <form
        onSubmit={(e: PDefault) => addNewProject(e)}
        className={
          "add-project flex-row " + (isLoading === "new" ? " loader-input" : "")
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
  );
};
