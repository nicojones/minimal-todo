import { ProjectContext } from "TodoApp";
import { Modal } from "components/Modal/Modal";
import { Task } from "components/Project/Task/Task";
import { text } from "config";
import { createTaskObject } from "functions/create-task-object";
import { IProjectContext, ITask, PDefault } from "interfaces";
import { Dispatch, SetStateAction, useContext, useEffect, useState, } from "react";
import { TaskService } from "services";

interface TaskModalAttrs {
  trigger?: {
    className: string;
    text: string;
  };
  task: ITask;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const TaskModal = (
  { trigger, task, modalOpen, setModalOpen }: TaskModalAttrs
) => {
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

  const { project, reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  useEffect(() => {
    setTaskName(task.name || "");
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || "");
    setPriority(task.priority || 0);
  }, [task]);

  const saveTask = (e: PDefault): Promise<any> => {
    e.preventDefault();

    setLoading(true);

    return TaskService.updateTask(
      {
        ...task,
        name: taskName,
        priority: priority,
        description: taskDesc
      }
    ).then((task: ITask | void) => {
      setLoading(false);
      setModalOpen(false);
      return reloadProjectTasks();
    });
  }

  const saveSubtask = (e: PDefault): Promise<void> => {
    e.preventDefault();
    setLoadingST(true);

    return TaskService.addTask(
      createTaskObject({
        name: subtaskName,
        parentId: task.id,
        level: task.level + 1,
        projectId: project.id,
      })
    )
      .then((task: ITask | void) => {
        reloadProjectTasks();
        setLoadingST(false);
        setSubtaskName("");
      });
  }

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
              required
              minLength={3}
              placeholder={text.task.name}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div>
            {/*<label>{ text.task.notes }</label>*/}
            <input
              value={taskDesc}
              className="materialize-textarea"
              placeholder={text.task.notes}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>
          <div>
            <label>{text.task.prio._}</label>
            <div className="flex-row">
              <button
                className={
                  "btn priority prio-0 " + (priority === 0 && "active")
                }
                onClick={() => setPriority(0)}
                type="button"
              >
                <i className="material-icons">flag</i>
              </button>
              <button
                className={
                  "btn priority prio-1 " + (priority === 1 && "active")
                }
                onClick={() => setPriority(1)}
                type="button"
              >
                <i className="material-icons">flag</i>
              </button>
              <button
                className={
                  "btn priority prio-2 " + (priority === 2 && "active")
                }
                onClick={() => setPriority(2)}
                type="button"
              >
                <i className="material-icons">flag</i>
              </button>
              <button
                className={
                  "btn priority prio-3 " + (priority === 3 && "active")
                }
                onClick={() => setPriority(3)}
                type="button"
              >
                <i className="material-icons">flag</i>
              </button>
            </div>
          </div>
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
                <button className="btn right"><i className="material-icons">add</i></button>
              ) : (
                ""
              )}
            </form>
          </li>
          {(subtasks || []).map((subtask) => (
            // <li key={subtask.id} data-tip={subtask.created} className="block">
            //   <label className="left">
            //     <input
            //       type="checkbox"
            //       checked={subtask.done}
            //       id={subtask.id}
            //       className="material-cb"
            //       onChange={() => toggleSubtask(subtask)}
            //     />
            //     <div />
            //   </label>
            //   <span className="left">{subtask.name}</span>
            // </li>
            <Task task={subtask} level={subtask.level + 1} key={subtask.id}/>
          ))}
        </ul>
      </Modal>
    </>
  );
};
