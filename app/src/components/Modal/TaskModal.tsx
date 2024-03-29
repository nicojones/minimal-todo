import { ProjectContext } from "TodoApp";
import { ColorAndIconPicker } from "components/ColorAndIconPicker/ColorAndIconPicker";
import { Modal } from "components/Modal/Modal";
import { Task } from "components/Project/Task/Task";
import { priorityIcons, projectIcons, text } from "config";
import { createTaskObject } from "functions/create-task-object";
import { validateTask } from "functions/validate-task.function";
import DateTimePicker from "react-datetime-picker";
import {
  IProject,
  IProjectContext,
  ITask,
  PDefault,
  ValidationResponse,
} from "interfaces";
import { WritableAtom, useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Observable, catchError, of, switchMap } from "rxjs";
import { TaskService, showToast } from "services";

import "./task-modal.scss";
import { Checkbox } from "components/Checkbox/Checkbox";

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
  const [taskDeadline, setTaskDeadline] = useState<ITask["deadline"]>(
    task.deadline || 0
  );
  const [taskAlert, setTaskAlert] = useState<ITask["alert"]>(task.alert ?? 0);
  const [taskName, setTaskName] = useState<ITask["name"]>(task.name || "");
  const [taskDone, setTaskDone] = useState<ITask["done"]>(task.done ?? false);
  const [taskTags, setTaskTags] = useState<string>((task.tags || []).join(" "));
  const [taskDesc, setTaskDesc] = useState<ITask["description"]>(
    task.description || ""
  );
  const [taskUrl, setTaskUrl] = useState<ITask["url"]>(task.url || "");
  const [taskNotes, setTaskNotes] = useState<ITask["notes"]>(task.notes || "");
  const [taskIsStarred, setTaskStarred] = useState<ITask["starred"]>(
    task.starred || false
  );
  const [backgroundColor, setBackgroundColor] = useState<
    ITask["backgroundColor"] | null
  >(task.backgroundColor || null);

  const [priority, setPriority] = useState<ITask["priority"]>(
    task.priority || 0
  );
  const [taskErrors, setTaskErrors] = useState<
    Partial<Record<keyof ITask, string | boolean>>
  >({});

  const { reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  useEffect(() => {
    setTaskName(task.name || "");
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || "");
    setTaskUrl(task.url || "");
    setTaskDone(task.done ?? false);
    setTaskNotes(task.notes || "");
    setTaskTags((task.tags || []).join(" "));
    setTaskDeadline(task.deadline || 0);
    setTaskAlert(task.alert || 0);
    setTaskStarred(task.starred ?? false);
    setBackgroundColor(task.backgroundColor || null);
    setPriority(task.priority || 0);
  }, [task]);

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [task.subtasks?.length]);

  const saveTask = (e: PDefault): void => {
    e.preventDefault();

    const taskToUpdate: ITask = {
      ...task,
      name: taskName,
      priority: priority,
      description: taskDesc,
      notes: taskNotes,
      backgroundColor: backgroundColor,
      url: taskUrl,
      starred: taskIsStarred,
      done: taskDone,
      tags: taskTags.split(/[,\s]+/).filter(Boolean),
      alert: +new Date(taskAlert),
      deadline: +new Date(taskDeadline),
    };

    if (Object.values(validateTask(taskToUpdate)).length) {
      setTaskErrors(validateTask(taskToUpdate));
      return;
    }
    setLoading(true);

    TaskService.updateTask(taskToUpdate)
      .pipe(
        switchMap<ITask | void, Observable<ITask[]>>((task: ITask | void) => {
          setLoading(false);
          setModalOpen(false);
          return reloadProjectTasks();
        }),
        catchError((validation: ValidationResponse) => {
          console.log(validation);
          showToast("error", validation.message);
          return of(null);
        })
      )
      .subscribe();
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
    )
      .pipe(
        switchMap<ITask | void, Observable<ITask[]>>((task: ITask | void) => {
          setLoadingST(false);
          setSubtaskName("");
          return reloadProjectTasks();
        })
      )
      .subscribe();
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
            <div className="flex-row flex-wrap flex-between">
              <span className="flex-row">
                <label
                  className={"d-flex align-center pointer prio-" + priority}
                  title={text.task.done}
                >
                  <Checkbox checked={taskDone} onChange={setTaskDone} />
                  <span>{text.task.done}</span>
                </label>
                <label className={`d-flex ml-27 starred align-center pointer starred-yellow ${
                      taskIsStarred ? "is-starred" : "not-starred"
                    }`}>
                  <button
                    title={text.task.starred}
                    className={"ml-5 mr-5 p-0 btn"}
                    onClick={() => setTaskStarred(!taskIsStarred)}
                    type="button"
                  >
                    <i className="material-icons">{projectIcons.star}</i>
                  </button>
                  <span>{text.task.starred}</span>
                </label>
              </span>
              <span className="d-flex align-center">
                <label>{text.task.prio._}</label>
                {priorityIcons.map((icon: string, priorityLevel: number) => (
                  <button
                    key={priorityLevel}
                    className={`btn priority prio-${priorityLevel} ${
                      priority === priorityLevel && "active"
                    }`}
                    onClick={() => setPriority(priorityLevel)}
                    type="button"
                  >
                    <i className="material-icons">{icon}</i>
                  </button>
                ))}
                {taskErrors.priority ? (
                  <small>{taskErrors.priority}</small>
                ) : null}
              </span>
            </div>
          </div>
          <div>
            {/*<label>{ text.task.name }</label>*/}
            <input
              value={taskName}
              className="input w-100 lg"
              autoCapitalize="none"
              placeholder={text.task.name}
              onChange={(e) => setTaskName(e.target.value)}
            />
            {taskErrors.name ? <small>{taskErrors.name}</small> : null}
          </div>
          <div>
            {/*<label>{ text.task.descr }</label>*/}
            <input
              value={taskDesc}
              className="input w-100 lg"
              placeholder={text.task.descr}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
            {taskErrors.description ? (
              <small>{taskErrors.description}</small>
            ) : null}
          </div>
          <div>
            {/*<label>{ text.task.url }</label>*/}
            <input
              value={taskUrl}
              className="input w-100 lg"
              placeholder={text.task.url}
              onChange={(e) => setTaskUrl(e.target.value)}
            />
            {taskErrors.url ? <small>{taskErrors.url}</small> : null}
          </div>
          <div className="flex-row align-center mt-10 pt-4">
            <span className="flex-row align-baseline">
              <label className="mr-5">{text.task.deadline}</label>
              <DateTimePicker
                onChange={(date: Date) => {
                  setTaskDeadline(+date);
                  setTaskAlert(+date);
                }}
                showLeadingZeros={true}
                calendarIcon={null}
                required={false}
                hourPlaceholder="hh"
                minutePlaceholder="mm"
                yearPlaceholder="yyyy"
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                value={taskDeadline ? new Date(taskDeadline) : undefined}
              />
            </span>
          </div>
          <div className="flex-row align-center mt-10 pt-4">
            <span className="flex-row align-baseline">
              <label className="mr-5">{text.task.alert._}</label>
              <DateTimePicker
                onChange={(date: Date) => {
                  setTaskAlert(+date);
                }}
                hourPlaceholder="hh"
                minutePlaceholder="mm"
                yearPlaceholder="yyyy"
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                calendarIcon={null}
                required={false}
                value={taskAlert ? new Date(taskAlert) : undefined}
              />
              {/* <span
                title={text.task.alert.title}
                className={`ml-5 p-0 flex-row align-center starred starred-green ${
                  taskAlert ? "" : "not-starred"
                }`}
              >
                <i className="material-icons mr-5">email</i>
                {taskAlert ? text.task.alert.yes : text.task.alert.no}
              </span> */}
            </span>
            {/* <label
              title={text.task.alert.title}
              className="ml-27 flex-row align-center"
            >
              <button
                title={text.task.alert.title}
                className={`ml-5 p-0 btn flex-row align-center starred starred-green ${
                  taskAlert ? "" : "not-starred"
                }`}
                onClick={() => setTaskAlert(!taskAlert)}
                type="button"
              >
                <i className="material-icons mr-5">email</i>
              </button>
              {taskAlert ? text.task.alert.yes : text.task.alert.no}
            </label> */}
            {taskErrors.deadline ? <small>{taskErrors.deadline}</small> : null}
          </div>
          <div style={{ display: "NONE" }}>
            {/*<label>{ text.task.notes }</label>*/}
            <input
              value={taskNotes}
              className="input w-100 lg"
              placeholder={text.task.notes}
              onChange={(e) => setTaskNotes(e.target.value)}
            />
            {taskErrors.notes ? <small>{taskErrors.notes}</small> : null}
          </div>
          <div>
            {/* <label>{ text.task.tags }</label> */}
            <input
              value={taskTags}
              className="input w-100 lg"
              placeholder={text.task.tags}
              onChange={(e) => setTaskTags(e.target.value)}
            />
            {taskErrors.tags ? <small>{taskErrors.tags}</small> : null}
          </div>
          {/* <div>
            <ColorAndIconPicker
              icon=""
              canEdit={true}
              color={backgroundColor || ""}
              hideIconPicker={true}
              onChangeComplete={({ color }) =>
                setBackgroundColor(color || null)
              }
            />
          </div> */}
          <button type="submit" className="far-away" />
        </form>

        <ul className="list-unstyled flex-column">
          <li
            key="new-subtask"
            className={"mb-15 " + (loadingST ? " loader-input" : "")}
          >
            <form onSubmit={saveSubtask} className="flex-row">
              <input
                onChange={(e) => setSubtaskName(e.target.value)}
                placeholder={addTaskPh}
                value={subtaskName}
                autoCapitalize="none"
                className="input lg w-100"
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
