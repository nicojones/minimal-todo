import { ITask } from "interfaces";
// import { format } from "timeago.js";
import dateformat from "dateformat";

import "./_task-info.scss";
import { constants, text } from "config";
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
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-between">
        <span className="task-name">
          {task.name}
          {subtasks.length > 0 ? (
            <small className="chip ml-5 ib" data-tip={text.subtaskStatus}>
              {subtasks.length - openLength}/{subtasks.length}
            </small>
          ) : null}
        </span>
        {(task.deadline || task.alert || task.tags.length || task.url) && (
          <span className="task-info">
            {task.deadline && (
              <span className="chip ml-5">
                {dateformat(task.deadline, constants.deadlineFormat)}
              </span>
            )}
            {task.alert && (
              <span className="chip ml-5">
                {dateformat(task.alert, constants.alertFormat)}
              </span>
            )}
            {task.tags.map((name: string) => (
              <small className="chip ml-5" key={name}>
                {name}
              </small>
            ))}
            {task.url && (
              <a
                className="chip ml-5"
                href={task.url}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                {task.url}
              </a>
            )}
          </span>
        )}
      </div>
      {task.description && (
        <small className="subtle ml-5">{task.description}</small>
      )}
    </div>
  );
};
