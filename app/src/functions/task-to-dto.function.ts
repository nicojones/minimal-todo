import {ITask} from "../interfaces";
import {stringTimestamp} from "./string-timestamp.function";

export const taskToDto = (task: ITask): ITask<string> => {
  return {
    ...task,
    created: stringTimestamp(task.created),
    updated: stringTimestamp(task.updated),
    subtasks: [], // we don't send subtasks to the server.
    timestamp: stringTimestamp(task.timestamp)
  };
}
