import { ProjectContext } from "TodoApp";
import { TaskModal } from "components/Modal/TaskModal";
import { constants, text, urls } from "config";
import { IProjectContext, ITask } from "interfaces";
import { useContext, useEffect, useState } from "react";
import { TaskService } from "services";
import { format } from "timeago.js";
import "./_task.scss";
import { useHistory } from "react-router-dom";

interface TaskAttrs {
  task: ITask;
  level?: number;
  onTaskToggle?: (task: ITask) => void;
  showDot?: boolean;
  showActions?: boolean;
  showGoToProject?: boolean;
  singleLevel?: boolean;
}
export const Task = ({ task, level, onTaskToggle, showDot, showActions, showGoToProject, singleLevel }: TaskAttrs) => {
  const history = useHistory();
  const [subtasks, setSubtasks] = useState<ITask[]>(task.subtasks || []);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expandedTask, setExpandedTask] = useState<boolean>(
    task.expanded || false
  );

  const { project, reloadProjectTasks } =
    useContext<IProjectContext>(ProjectContext);

  const openLength = subtasks.filter((s: ITask) => !s.done).length || 0;

  const doneClass = (task.done && project.showCompleted && "done") || "";
  // const doneClass = (task.checked ? (project.showCompleted ? 'done' : '') : '');

  const showExpanderClass =
    (subtasks.length > 0 && !singleLevel)
      ? // project.showCompleted ? subtasks.length : openLength
        ""
      : " v-hidden";

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  const toggleCompleted = (
    taskToUpdate: ITask,
    toggleSubtasks: boolean = false
  ): void => {
    taskToUpdate.done = !taskToUpdate.done;
    // after changing the state...
    TaskService.toggleTask(task, toggleSubtasks).then((updatedTask: ITask) => {
      if (updatedTask.done) {
        // set all subtasks as checked, since the main task was marked as checked.
        // (task.subtasks || []).forEach((_task) => _task.checked = true);
        updatedTask.expanded = false;
      }

      setSubtasks(updatedTask.subtasks);

      onTaskToggle && onTaskToggle(updatedTask);
    });
  };

  const subtaskUpdated = (updatedSubtask: ITask): void => {
    setSubtasks(
      subtasks.map((t: ITask) => {
        return t.id === updatedSubtask.id ? updatedSubtask : t;
      })
    );
  };

  /**
   * If you want to say the toggle state, just update this function
   */
  const toggleExpanded = (isExpanded: boolean): Promise<ITask | void> => {
    task.expanded = isExpanded;
    setExpandedTask(isExpanded);
    return TaskService.updateTask({ ...task });
  };

  const onDelete = (task: ITask): void => {
    if (window.confirm(text.task.delete.all)) {
      TaskService.deleteTask(task).then(() => reloadProjectTasks());
    }
  };

  return (
    <li className={doneClass + " task parent-hover " + (showActions ? ' show-actions' : '')} key={task.id}>
      <div className="task__content" title={format(task.created)}>
        <button
          className={
            "toggle-expand subtle ib material-icons tiny left btn-pr" +
            (expandedTask ? " expanded" : "") +
            showExpanderClass
          }
          onClick={() => toggleExpanded(!expandedTask)}
        >
          chevron_right
        </button>
        { showGoToProject 
        ? <button className="btn p-0" onClick={() => history.push(urls.project(task.projectSecret)) }>
          <i className="material-icons small-icon mr-11">login</i>
        </button>
         : null}
        {showDot ? (
          <i
            className="project-dot material-icons"
            style={{ color: task.dotColor }}
            title={text.task.projectDot(task.projectName)}
          >
            {task.icon}
          </i>
        ) : null}

        <label className={"left prio-" + task.priority}>
          <input
            type="checkbox"
            className="material-cb"
            checked={task.done}
            onChange={() => toggleCompleted(task)}
          />
          <div />
        </label>
        <button
          className={"left-align ib " + (task.done ? "" : "")}
          onClick={() => setModalOpen(true)}
        >
          <span className="task-name">{task.name}</span>
          {subtasks.length > 0 ? (
            <small
              className="subtle child-hover ml-5 ib"
              data-tip={text.subtaskStatus}
            >
              {subtasks.length - openLength}/{subtasks.length}
            </small>
          ) : null}
          {task.description && (
            <small className="subtle ml-5">{task.description}</small>
          )}
        </button>

        <span className="ml-auto flex-row">
          <button
            className="material-icons ib task__action-button child-hover"
            data-tip={text.task.delete._}
            onClick={() => onDelete(task)}
          >
            delete
          </button>
          <button
            className="material-icons ib task__action-button child-hover"
            data-tip={text.task.edit}
            onClick={() => setModalOpen(true)}
          >
            edit
          </button>

          <TaskModal
            task={{ ...task }}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </span>
      </div>
      {expandedTask && task.level < constants.maxDepth && (
        <ul
          className="subtasks"
          aria-details={(level || 0) as unknown as string}
        >
          {subtasks.map((t) => (
            <Task
              key={t.id}
              task={t}
              level={(level || 0) + 1}
              onTaskToggle={subtaskUpdated}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
