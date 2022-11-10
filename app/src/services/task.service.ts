import {auth, db, pbClient} from './firebase';
import {showToast} from './toast';
import {IProject, ITask, PbItem} from '../interfaces';
import {authService} from "./auth.service";
import {constants} from "../config";
import {ID} from "../interfaces/identifiable.interface";
import {taskToDto} from "../functions/task-to-dto.function";
import {projectToDto} from "../functions/project-to-dto.function";


export const taskService = {

  db: db(),

  headers: () => {
    return {authorization: localStorage.getItem(constants.storageKey.AUTH_TOKEN)};
  },

  updateTask: async (project: IProject, task: ITask) => {
    try {
      pbClient.records.update(
        'projects',
        task.project,
        projectToDto(project)
      );
      return pbClient.records.update("tasks", task.id, taskToDto(task))
    } catch (e) {
      authService.handleError('Error on update task: ' + e.response.data.message, e);
    }
  },

  addTask: async (project: IProject, task: ITask): Promise<ID> => {
    try {
      return pbClient.records.create('tasks', taskToDto(task))
        .then((response: unknown) => {
          return (response as ITask).id;
        })
        .then((taskId: ID) => {
          pbClient.records.update(
            'projects',
            project.id,
            {...project, tasks: [...project.tasks, taskId]} as IProject
          )
          return taskId;
        })
    } catch (e: any) {
      authService.handleError('Error on save task: ', e);
      return "";
    }
  },

  deleteTask: async (task: ITask) => {
    try {
      return pbClient.records.delete(`tasks`, task.id)
        .then((response) => {
          console.info('result from DELETE', response);
          showToast(response ? 'success' : 'error', response ? 'Deleted' : 'Error');
        });
    } catch (e) {
      authService.handleError('Error on delete task: ', e);
    }
  },

  getTasksForProject: (
    projectKey: IProject['id'],
    sort: IProject['sort'],
    done: (tasks: ITask[]) => any,
    realtime: boolean = true
  ) => {
    try {
      (pbClient.records.getFullList("tasks", 10000, {
        filter: `project = "${projectKey}"`,
        sort: sort
      }) as unknown as Promise<PbItem<ITask>[]>)
        .then((results: PbItem<ITask>[]) => {
          done(results)
        });
    } catch (e) {
      authService.handleError('Error on fetching tasks: ', e);
    }

    if (realtime) {
      pbClient.realtime.subscribe(`projects/${projectKey}`, (action: any) => {
        taskService.getTasksForProject(projectKey, sort, done, false);
      });
    }
    return () => pbClient.realtime.unsubscribe(`projects/${projectKey}/tasks`);
  },

  toggleTask: (project: IProject, task: ITask) => {
    try {
      return taskService.updateTask(project, task);
    } catch (e) {
      authService.handleError('Error on updating "checked" task: ', e);
    }
  },

  searchTask: (searchTerm: string) => {
    try {
      return taskService.db
        .collectionGroup('tasks')
        // @ts-ignore
        .where('_uids', 'array-contains', auth().currentUser?.uid)
        .where('_name_lower', '>=', searchTerm.toLowerCase())
        .where('_name_lower', '<=', searchTerm.toLowerCase() + 'zzz')
        .orderBy('_name_lower', 'asc')
        .get()
        .then((doc) => {
          const results: ITask[] = [];
          doc.forEach((d) => {
            results.push({
              ...d.data(),
              id: d.id
            } as ITask);
          });
          console.log(results);
          return results;
        });
    } catch (e) {
      authService.handleError('Error on searching tasks: ', e);
    }
  }

};
