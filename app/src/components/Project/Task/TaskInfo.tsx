import { ITask } from "interfaces";
// import { format } from "timeago.js";

import "./_task-info.scss";
import { text } from "config";
import { useMemo } from "react";

interface TaskInfoAttrs {
  task: ITask;
  subtasks: ITask[];
}
export const TaskInfo = ({ task, subtasks }: TaskInfoAttrs) => {

  const openLength = useMemo(() => {
    return (subtasks || []).filter((s: ITask) => !s.done).length || 0;
  }, [subtasks]);

  return (
    <>
      <span className="task-name">{task.name}</span>
      {subtasks.length > 0 ? (
        <small
          className="chip ml-5 ib"
          data-tip={text.subtaskStatus}
        >
          {subtasks.length - openLength}/{subtasks.length}
        </small>
      ) : null}
      {task.deadline && (
        <span className="chip ml-5">
          {new Date(task.deadline).toLocaleDateString()}
        </span>
      )}
      {task.tags.map((name: string) => <small className="chip ml-5" key={name}>{name}</small>)}
      {task.url && (
        <small className="subtle ml-5">
          <a
            href={task.url}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            {task.url}
          </a>
        </small>
      )}
      {task.description && (
        <small className="subtle ml-5">{task.description}</small>
      )}
    </>
  );
};
