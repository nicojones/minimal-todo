import { ProjectContext } from "TodoApp";
import { text } from "config";
import { createTaskObject } from "functions/create-task-object";
import { IProjectContext, PDefault, ITask, LoadingStates, IProject } from "interfaces";
import { WritableAtom, useAtom } from "jotai";
import {
  useState,
  ChangeEvent,
  useContext,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { Observable, switchMap, tap } from "rxjs";
import { TaskService } from "services";
import { projectAtom } from "store";

interface NewTaskProps {
  isLoading: LoadingStates;
  setIsLoading: Dispatch<SetStateAction<LoadingStates>>;
  reloadTasks: () => Observable<ITask[]>;
}

export const NewTask = ({
  setIsLoading,
  reloadTasks,
  isLoading,
}: NewTaskProps) => {

  const [project] = useAtom<IProject | null>(projectAtom);

  const [taskName, setTaskName] = useState("");

  const taskNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTaskName(e.target.value);
  };

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [project?.secret]);

  const addTask = (e: PDefault): Observable<ITask[]> => {
    e.preventDefault();
    setIsLoading("t");

    return TaskService.addTask(
      createTaskObject({
        name: taskName,
        projectId: (project as IProject).id,
      })
    ).pipe(
      switchMap<ITask | void, Observable<ITask[]>>((task: ITask | void) => {
        setTaskName("");
        return reloadTasks();
      })
    );
  };

  return (
    <li className="task">
      <form
        onSubmit={(e: PDefault) => addTask(e).subscribe()}
        className={
          "flex-row task__content form-inline" +
          (isLoading === "t" ? " loader-input" : "")
        }
      >
        {/*className={ 'flex-row task__content form-inline' + (isLoading === 't' ? ' loader-input' : '') }>*/}
        <i
          /* Just to give the right padding */ className="material-icons left v-hidden btn-p"
        >
          add
        </i>
        <button className="btn p0">
          <i className="material-icons left subtle btn-pr">
            {taskName ? "save" : "add"}
          </i>
        </button>
        <div className="flex-center-start w-100">
          <div className="input-group mb-2">
            <input
              onChange={taskNameChange}
              className="invisible f-100 btn-pl"
              placeholder={addTaskPh}
              required
              value={taskName}
              id="add-project-task" // used also in NoProject
              disabled={isLoading === "t"}
              autoComplete="off"
              /* ref={ inputElement } */
            />
          </div>
        </div>
      </form>
    </li>
  );
};
