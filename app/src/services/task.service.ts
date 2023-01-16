import { Observable } from "rxjs";
import { IProject, ITask } from "../interfaces";
import { minimalAxios } from "./axios.service";

export class TaskService {
  public static updateTask = (task: ITask): Observable<ITask | void> => {
    return minimalAxios<ITask>("PUT", `/api/tasks`, {
      body: task,
      error: `Error updating task`,
      default: null,
    });
  };

  public static addTask = (task: ITask): Observable<ITask | void> => {
    return minimalAxios<ITask>("POST", `/api/tasks`, {
      body: task,
      error: `Error adding task`,
      default: null,
    });
  };

  public static deleteTask = (task: ITask): Observable<void> => {
    return minimalAxios<void, ITask>("DELETE", `/api/tasks/${task.id}`, {
      error: `Error deleting task`,
      default: null,
    });
  };

  public static getTasksForProject = (
    projectId: IProject["id"]
  ): Observable<ITask[]> => {
    return minimalAxios<ITask[]>(
      "GET",
      `/api/tasks/?project=${projectId}`,
      { error: `Error getting tasks for project`, default: [] }
    );
  };

  public static toggleTask = (
    task: ITask,
    toggleSubtasks: boolean
  ): Observable<ITask> => {
    return minimalAxios<ITask>(
      "PATCH",
      `/api/tasks/toggle/${task.id}?toggleSubtasks=${
        toggleSubtasks ? 1 : 0
      }`,
      { error: "Couldn't toggle task", default: task }
    );
  };

  public static searchTask = (searchTerm: string): Observable<ITask[]> => {
    return minimalAxios<ITask[]>("GET", `/api/tasks/search/?q=${searchTerm}`, {
      error: `Error searching tasks for "${searchTerm}`,
      default: [],
    });
  };
}
