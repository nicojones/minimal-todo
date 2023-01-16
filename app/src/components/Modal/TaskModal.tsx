import { ProjectContext } from "TodoApp";
import { Modal } from "components/Modal/Modal";
import { Task } from "components/Project/Task/Task";
import { priorityIcons, text } from "config";
import { createTaskObject } from "functions/create-task-object";
import { validateTask } from "functions/validate-task.function";
import { IProject, IProjectContext, ITask, PDefault } from "interfaces";
import { WritableAtom, useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Observable, switchMap } from "rxjs";
import { TaskService } from "services";
import { projectAtom } from "store";

interface TaskModalAttrs {
  trigger?: {
    className: string;
    text: string;
  };
  task: ITask;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const TaskModal = ({
  trigger,
  task,
  modalOpen,
  setModalOpen,
}: TaskModalAttrs) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingST, setLoadingST] = useState<boolean>(false);
  const [subtaskName, setSubtaskName] = useState<string>("");
  const [subtasks, setSubtasks] = useState<ITask[]>(task.subtasks || []);
  const [taskName, setTaskName] = useState<ITask["name"]>(task.name || "");
  const [taskDesc, setTaskDesc] = useState<ITask["description"]>(
    task.description || ""
  );
  const [priority, setPriority] = useState<ITask["priority"]>(
    task.priority || 0
  );
  const [taskErrors, setTaskErrors] = useState<Partial<Record<keyof ITask, string | boolean>>>({});

  const { reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  const [project] = useAtom<IProject>(
    projectAtom as WritableAtom<IProject, IProject>
  );

  useEffect(() => {
    setTaskName(task.name || "");
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || "");
    setPriority(task.priority || 0);
  }, [task]);

  const saveTask = (e: PDefault): void => {
    e.preventDefault();

    const taskToUpdate: ITask = {
      ...task,
      name: taskName,
      priority: priority,
      description: taskDesc,
    };

    if (Object.values(validateTask(taskToUpdate)).length) {
      setTaskErrors(validateTask(taskToUpdate));
      return;
    }
    setLoading(true);

    TaskService.updateTask(taskToUpdate).pipe(
      switchMap<ITask | void, Observable<ITask[]>>((task: ITask | void) => {
        setLoading(false);
        setModalOpen(false);
        return reloadProjectTasks();
      })
    ).subscribe();
  };

  const saveSubtask = (e: PDefault): void => {
    e.preventDefault();
    setLoadingST(true);

    TaskService.addTask(
      createTaskObject({
        name: subtaskName,
        parent_id: task.id,
        level: task.level + 1,
        project_id: task.project_id,
      })
    ).pipe(
      switchMap<ITask | void, Observable<ITask[]>>((task: ITask | void) => {
        setLoadingST(false);
        setSubtaskName("");
        return reloadProjectTasks();
      })
    ).subscribe();
  };

  return (
    <>
      {trigger && (
        <button
          className={trigger.className}
          onClick={() => setModalOpen(true)}
        >
          {trigger.text}
        </button>
      )}
      <Modal
        modalOpen={modalOpen}
        loading={loading}
        onAccept={saveTask}
        onCancel={() => setModalOpen(false)}
        okButton={'<i class="material-icons right">save</i>'}
        cancelButton={'<i class="material-icons right">close</i>'}
      >
        {/*<h6 className="subtle mb-15 mt-5">{ project.name }</h6>*/}
        <form onSubmit={saveTask}>
          <div>
            {/*<label>{ text.task.name }</label>*/}
            <input
              value={taskName}
              placeholder={text.task.name}
              onChange={(e) => setTaskName(e.target.value)}
            />
            { taskErrors.name ? <small>{taskErrors.name}</small> : null }
          </div>
          <div>
            {/*<label>{ text.task.notes }</label>*/}
            <input
              value={taskDesc}
              className="materialize-textarea"
              placeholder={text.task.notes}
              onChange={(e) => setTaskDesc(e.target.value)}
              />
              { taskErrors.description ? <small>{taskErrors.description}</small> : null }
          </div>
          <div>
            <label>{text.task.prio._}</label>
            <div className="flex-row">
              {priorityIcons.map((icon: string, priorityLevel: number) => 
                <button
                key={priorityLevel}
                className={
                  `btn priority prio-${priorityLevel} ${priority === priorityLevel && "active"}`
                }
                onClick={() => setPriority(priorityLevel)}
                type="button"
                >
                  <i className="material-icons">{icon}</i>
                </button>
              )}
              { taskErrors.priority ? <small>{taskErrors.priority}</small> : null }
            </div>
          </div>
          <button type="submit" className="far-away"/>
        </form>

        <ul className="list-unstyled flex-column">
          <li key="new-subtask" className={loadingST ? " loader-input" : ""}>
            <form onSubmit={saveSubtask} className="flex-row">
              <input
                onChange={(e) => setSubtaskName(e.target.value)}
                placeholder={text.task.subtasks}
                value={subtaskName}
                className="input-field"
                required
                minLength={3}
              />
              {subtaskName ? (
                <button className="btn right">
                  <i className="material-icons">add</i>
                </button>
              ) : (
                ""
              )}
            </form>
          </li>
          {(subtasks || []).map((subtask) => (
            <Task task={subtask} level={subtask.level + 1} key={subtask.id} />
          ))}
        </ul>
      </Modal>
    </>
  );
};
