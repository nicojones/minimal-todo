import { ProjectContext } from "TodoApp";
import { NoProject } from "components/NoProject/NoProject";
import { ProjectHeader } from "components/Project/ProjectHeader/ProjectHeader";
import { Task } from "components/Project/Task/Task";
import { projectSort, text } from "config";
import { useContext, useEffect, useMemo, useState } from "react";
import { ProjectService } from "services/project.service";
import {
  IProject,
  IProjectContext,
  ITask,
  LoadingStates,
  SpecialProjectUrl,
} from "../../interfaces";
import { NewTask } from "./Task/NewTask";
import "./_project.scss";
import { reservedKey } from "functions/reserved-key";
import { Observable, switchMap, tap } from "rxjs";
import { WritableAtom, useAtom } from "jotai";
import { projectAtom, tasksAtom } from "store";

interface ProjectAttrs {
  specialUrl?: SpecialProjectUrl;
}

export const Project = ({ specialUrl }: ProjectAttrs) => {
  const { reloadProjects, reloadProjectTasks } =
    useContext<IProjectContext>(ProjectContext);

  const [tasks] = useAtom<ITask[]>(tasksAtom);
  const [project, setProject] = useAtom<IProject | null, IProject | null, void>(
    projectAtom
  );

  const [sort, setSort] = useState(project?.sort || projectSort.OLDEST_FIRST);
  const [isLoading, setIsLoading] = useState<LoadingStates>("yes");
  const [showCompleted, setShowCompleted] = useState(!!project?.showCompleted);
  const [editListName, setEditListName] = useState(false);

  const open = tasks.filter((task: ITask) => !task.done);
  const completed = tasks.filter((task: ITask) => !!task.done);

  const allCompleted = useMemo(() => {
    if (
      !open.length &&
      ((completed.length && !showCompleted) || !!specialUrl)
    ) {
      return (
        <li>
          <NoProject className="o-1" inspireText={text.allTasksCompleted()} />
        </li>
      );
    }
    return "";
  }, [tasks, showCompleted]);

  useEffect(() => {
    setShowCompleted(project?.showCompleted || false);
    setIsLoading("p");
    setEditListName(false);

    reloadTasks().subscribe();
  }, [project?.secret || ""]);

  const reloadTasks = (): Observable<ITask[]> => {
    return reloadProjectTasks().pipe(
      tap((tasks: ITask[]) => {
        setIsLoading("");
        return tasks;
      })
    );
  };

  const changedSort = (newSort: string): Observable<ITask[]> => {
    setSort(newSort);

    setProject({ ...(project as IProject), sort: newSort });

    return ProjectService.updateProject({
      ...(project as IProject),
      sort: newSort,
    }).pipe(switchMap(() => reloadProjectTasks()));
  };

  const updateProject = (
    partialProject: Partial<IProject>
  ): void => {
    setIsLoading("n");
    ProjectService.updateProject({
      ...(project as IProject),
      ...partialProject,
    }).pipe(
      switchMap((p: IProject | void) => {
        setEditListName(false);
        setIsLoading("");
        setProject(p as IProject);
        return reloadProjects();
      })
    ).subscribe();
  };

  return (
    <div className={isLoading === "p" ? "loader-input cover" : ""}>
      <ProjectHeader
        pf={{
          updateProject,
          editListName,
          setEditListName,
          showCompleted,
          setShowCompleted,
          sort,
          setSort: changedSort,
          canEdit: !specialUrl,
          isLoading,
        }}
      />

      <ul>
        {open.map((task) => (
          <Task
            key={task.id}
            task={task}
            level={0}
            showDot={reservedKey(project?.secret)}
          />
        ))}
        {specialUrl ? null : (
          <>
            {showCompleted &&
              completed.map((task) => <Task key={task.id} task={task} />)}

            <NewTask
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              reloadTasks={reloadTasks}
            />
          </>
        )}
        {allCompleted}
      </ul>
    </div>
  );
};
