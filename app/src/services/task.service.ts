import {CaughtPromise, IProject, ITask} from '../interfaces';
import {AuthService} from "./auth.service";
import { minimalAxios } from './axios.service';
import { AxiosResponse } from 'axios';


export class TaskService {

  public static updateTask = (task: ITask): Promise<ITask | void> => {
    return minimalAxios.put(
      `/api/tasks`,
      task
    )
    .then((response: AxiosResponse<ITask>) => response.data)
    .catch((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on update task');
    })
  };

  public static addTask = (task: ITask): Promise<ITask | void> => {
    return minimalAxios.post(
      `/api/tasks`,
      task
    )
    .then((response: AxiosResponse<ITask>) => response.data)
    .catch((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on save task');
    })
  }

  public static deleteTask = (task: ITask): Promise<void> => {
    return minimalAxios.delete(
      `/api/tasks/${task.id}`
    )
    .then((response: AxiosResponse<void>) => response.data)
    .catch((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on save task');
    })
  }

  public static getTasksForProject = (
    projectSecret: IProject['secret'],
  ): Promise<ITask[]> => {
    return minimalAxios.get(
      `/api/tasks/?projectSecret=${projectSecret}`
    )
    .then((response: AxiosResponse<ITask[]>) => response.data)
    .catch ((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on fetching tasks');
      return [];
    });
  };

  public static toggleTask = (task: ITask, toggleSubtasks: boolean): Promise<ITask> => {
    return minimalAxios.patch(
      `/api/tasks/toggle/${task.id}?toggleSubtasks=1&a=${toggleSubtasks ? 1 : 0}`
    )
    .then((response: AxiosResponse<ITask>) => response.data)
    .catch((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on save task');
      return task;
    });
  };

  public static searchTask = (searchTerm: string): Promise<ITask[]> => {
    return minimalAxios.get(
      `/api/tasks/search/?q=${searchTerm}`
    )
    .then((response: AxiosResponse<ITask[]>) => response.data)
    .catch((e: CaughtPromise) => {
      AuthService.handleError(e, 'Error on searching tasks');
      return [];
    });
  }

};
