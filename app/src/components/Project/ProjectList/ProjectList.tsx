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
import { Observable, of, switchMap, tap } from "rxjs";
import { useAtom } from "jotai";
import { projectAtom, projectsAtom } from "store";
import { NewProject } from "./NewProject";

interface ProjectListAttrs {
}

export const ProjectList = ({  }: ProjectListAttrs) => {
  const { changeToProject, reloadProjects } =
    useContext<IProjectContext>(ProjectContext);

  const [project] = useAtom<IProject | null>(projectAtom);
  const [projects] = useAtom<IProject[]>(projectsAtom);
  const [isLoading, setIsLoading] = useState<"" | "new" | IProject["secret"]>(
    ""
  );

  const deleteProject = (_project: IProject): void => {
    if (window.confirm(text.project.delete.long)) {
      setIsLoading(_project.secret);
      ProjectService.deleteProject(_project)
        .pipe(
          switchMap(() => {
            changeToProject(null);
            setIsLoading("");
            return reloadProjects();
          })
        )
        .subscribe();
    }
  };

  const setProject = (_project: IProject): void => {
    if (_project.secret === project?.secret) {
      changeToProject(null); // can't change to itself... it also causes a re-render problem in the `useEffect`
    }
    console.info(
      "Changing project from",
      project?.secret,
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
          deleteProject={() => of()}
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
      <NewProject isLoading={isLoading} setIsLoading={setIsLoading}/>
    </ul>
  );
};
