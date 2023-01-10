import { ProjectContext } from "TodoApp";
import { ColorAndIconPicker } from "components/ColorAndIconPicker/ColorAndIconPicker";
import { ProjectOptions } from "components/Project/ProjectOptions/ProjectOptions";
import { text } from "config";
import {
  ColorIconChoice,
  IProject,
  IProjectContext,
  ITask,
  LoadingStates,
} from "interfaces";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { ProjectService } from "services/project.service";

import "./project-header.scss";
import { Observable, of, switchMap, tap } from "rxjs";
import { showToast } from "services";
import { WritableAtom, useAtom } from "jotai";
import { projectAtom } from "store";

interface ProjectHeaderAttrs {
  pf: {
    updateProject: (
      partialProject: Partial<IProject>
    ) => void;
    editListName: boolean;
    setEditListName: Dispatch<SetStateAction<boolean>>;
    showCompleted: boolean;
    setShowCompleted: Dispatch<SetStateAction<boolean>>;
    sort: string;
    setSort: (sort: string) => Observable<ITask[]>;
    canEdit: boolean;
    isLoading: LoadingStates;
  };
}

export const ProjectHeader = ({ pf }: ProjectHeaderAttrs) => {
  const {
    reloadProjects,
    changeToProject,
    openAddUserModal,
    reloadProjectTasks,
  } = useContext<IProjectContext>(ProjectContext);
  const [project] = useAtom<IProject | null>(projectAtom);
  const [moreDropdown, showMoreDropdown] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<IProject["name"]>(
    project?.name || ""
  );

  const psc = pf.showCompleted;

  const deleteProject = (): Observable<IProject[]> => {
    if (window.confirm(text.project.delete._)) {
      return ProjectService.deleteProject(project as IProject).pipe(
        switchMap(() => {
          changeToProject(null);
          return reloadProjects();
        })
      );
    }
    return of([]);
  };

  const deleteTasks = (): Observable<ITask[]> => {
    if (window.confirm(text.project.delete.tasks)) {
      return ProjectService.deleteProjectTasks(project as IProject).pipe(
        tap(() => showToast("success", text.task.delete.allDeleted)),
        switchMap(() => reloadProjectTasks())
      );
    }
    return of([]);
  };

  const share = (): Promise<void> | void => {
    showMoreDropdown(false);
    openAddUserModal(project);
  };

  const toggleShowCompleted = (
    showCompleted: boolean
  ): Observable<IProject[]> => {
    pf.setShowCompleted(showCompleted);
    return ProjectService.updateProject({
      ...(project as IProject),
      showCompleted,
    }).pipe(
      switchMap(() => {
        return reloadProjects();
      })
    );
  };

  const updateColorAndIcon = (colorAndIcon: ColorIconChoice): void => {
    pf.updateProject(colorAndIcon);
  };

  return pf.editListName ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        pf.updateProject({...project, name: projectName} as IProject);
      }}
      className={"project-name-form flex-row " + (pf.isLoading === "n" ? " loader-input" : "")}
    >
      <input
        className="as-title h5 project-title"
        autoFocus /*onBlur={ project.saveListName }*/
        value={project?.name || ""}
        disabled={pf.isLoading === "n"}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <button className="ib material-icons" type="submit">
        save
      </button>
      <button
        className="ib material-icons"
        onClick={() => pf.setEditListName(false)}
      >
        close
      </button>
    </form>
  ) : (
    <div className="project-title-bar" data-tip={text.project.title._}>
      <div className="project-title">
        <ColorAndIconPicker
          icon={project?.icon || ""}
          color={project?.color || ""}
          onChangeComplete={updateColorAndIcon}
          canEdit={pf.canEdit}
        />
        <h5
          className="project-header"
          onClick={() => (pf.canEdit ? pf.setEditListName(true) : null)}
        >
          {project?.name || ""}
        </h5>
        {!!project?.shared ? (
          <button className="ib p-0 right-align" title={text.sharedProject._} onClick={() => share()}>
            <i className="material-icons tiny left btn-pr ml-5">person</i>
          </button>
        ) : null}
      </div>
      {pf.canEdit ? (
        <ProjectOptions
          sort={pf.sort}
          setSort={pf.setSort}
          moreDropdown={moreDropdown}
          showMoreDropdown={showMoreDropdown}
        >
          <li className="dropdown-item" key="completed">
            <button
              className="ib w-100 left-align"
              onClick={() => toggleShowCompleted(!psc).subscribe()}
            >
              <i className="material-icons tiny left btn-pr">
                {psc ? "check_box_outline_blank" : "check_box"}
              </i>
              {psc ? text.hideCompleted : text.showCompleted}
            </button>
          </li>
          <li className="dropdown-item" key="share">
            <button className="ib w-100 left-align" onClick={() => share()}>
              <i className="material-icons tiny left btn-pr">person_add</i>
              {text.project.share}
            </button>
          </li>
          <li className="dropdown-item" key="tasks">
            <button
              className="ib w-100 left-align"
              onClick={() => deleteTasks().subscribe()}
            >
              <i className="material-icons tiny left btn-pr">delete_forever</i>
              {text.project.delete.tasks}
            </button>
          </li>
          {!project?.shared ? (
            <li className="dropdown-item" key="delete">
              <button
                className="ib w-100 left-align"
                onClick={() => deleteProject().subscribe()}
              >
                <i className="material-icons tiny left btn-pr">delete</i>
                {text.project.delete._}
              </button>
            </li>
          ) : null}
        </ProjectOptions>
      ) : null}
    </div>
  );
};
