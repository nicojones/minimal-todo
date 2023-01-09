import { ProjectContext } from "TodoApp";
import { ColorAndIconPicker } from "components/ColorAndIconPicker/ColorAndIconPicker";
import { text } from "config";
import { reservedKey } from "functions/reserved-key";
import {
  ColorIconChoice,
  IProject,
  IProjectContext,
  MinimalProject,
} from "interfaces";
import { useContext } from "react";
import { ProjectService } from "services";
import { ProjectListDropdown } from "./ProjectListDropdown";

import "./_project-list-item.scss";
import { Observable, map, switchMap } from "rxjs";
import { useAtom } from "jotai";
import { projectAtom } from "store";

interface ProjectListItemAttrs {
  project: MinimalProject;
  isLoading: "" | "new" | IProject["secret"];
  setProject: (project: IProject) => void;
  deleteProject: (project: IProject) => void;
  isSpecialProject: boolean;
}

export const ProjectListItem = ({
  project: proj,
  isLoading,
  setProject,
  deleteProject,
  isSpecialProject,
}: ProjectListItemAttrs) => {
  const { reloadProjects } =
    useContext<IProjectContext>(ProjectContext);

  const [selectedProject, setSelectedProject] = useAtom<
    IProject | null,
    IProject | null,
    void
  >(projectAtom);

  const changeColorAndIcon = (
    _project: IProject,
    iconAndColor: ColorIconChoice
  ): void => {
    ProjectService.updateProject({
      ..._project,
      ...iconAndColor,
    })
      .pipe(
        switchMap((p: IProject | void) => {
          // if the project is open, update it.
          if (p?.secret === selectedProject?.secret) {
            setSelectedProject(p as IProject);
          }
          return reloadProjects();
        })
      )
      .subscribe();
  };

  return (
    <li
      key={proj.secret}
      className={
        "proj-li mb-5 parent-hover flex-row" +
        (selectedProject?.secret === proj.secret ? " selected" : "") +
        (isLoading === proj.secret ? " loader-input" : "")
      }
    >
      <ColorAndIconPicker
        color={proj.color}
        icon={proj.icon}
        canEdit={!isSpecialProject}
        onChangeComplete={(colorAndIcon: ColorIconChoice) =>
          changeColorAndIcon(proj as IProject, colorAndIcon)
        }
      ></ColorAndIconPicker>
      <button
        className="ib left left-align btn-p w-100"
        onClick={() => setProject(proj as IProject)}
      >
        <span
          className="d-flex align-center project-name"
          title={(proj as IProject).shared ? text.sharedProject._ : ""}
        >
          {proj.name}
          {(proj as IProject).shared ? (
            <i className="material-icons small-icon ml-5">person</i>
          ) : (
            ""
          )}
        </span>

        {/*( { proj.openTasks } <span className="subtle">/ { proj.completedTasks }</span> )*/}
      </button>
      {isSpecialProject ? null : (
        <ProjectListDropdown
          project={proj as IProject}
          onDelete={deleteProject}
        />
      )}
    </li>
  );
};
