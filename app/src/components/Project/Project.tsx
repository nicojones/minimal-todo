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
  const [show_completed, setshow_completed] = useState(
    !!project?.show_completed
  );
  const [editListName, setEditListName] = useState(false);

  const open = tasks.filter((task: ITask) => !task.done);
  const completed = tasks.filter((task: ITask) => !!task.done);

  const allCompleted = useMemo(() => {
    if (
      !open.length &&
      ((completed.length && !show_completed) || !!specialUrl)
    ) {
      return (
        <li>
          <NoProject className="o-1" inspireText={text.allTasksCompleted()} />
        </li>
      );
    }
    return "";
  }, [tasks, show_completed]);

  useEffect(() => {
    setshow_completed(project?.show_completed || false);
    setIsLoading("p");
    setEditListName(false);

    reloadTasks().subscribe();
  }, [project?.id || ""]);

  const reloadTasks = (): Observable<ITask[]> => {
    return reloadProjectTasks().pipe(
      tap((tasks: ITask[]) => {
        setIsLoading("");
        return tasks;
      })
    );
  };

  const changedSort = (newSort: string): void => {
    setSort(newSort);

    setProject({ ...(project as IProject), sort: newSort });

    ProjectService.updateProject({
      ...(project as IProject),
      sort: newSort,
    })
      .pipe(switchMap(() => reloadProjectTasks()))
      .subscribe();
  };

  const updateProject = (partialProject: Partial<IProject>): void => {
    setIsLoading("n");
    ProjectService.updateProject({
      ...(project as IProject),
      ...partialProject,
    })
      .pipe(
        switchMap((p: IProject | void) => {
          setEditListName(false);
          setIsLoading("");
          setProject(p as IProject);
          return reloadProjects();
        })
      )
      .subscribe();
  };

  return (
    <div className={isLoading === "p" ? "loader-input cover" : ""}>
      <ProjectHeader
        pf={{
          updateProject,
          editListName,
          setEditListName,
          show_completed,
          setshow_completed,
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
            showDot={reservedKey(project?.id)}
          />
        ))}
        {specialUrl ? null : (
          <>
            {show_completed &&
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
