import { auth, db } from './firebase';
import axios from 'axios';
import { environment } from './environment';
import { handleError } from './handle-error';
import { time } from 'functions/time';
import { showToast } from './toast';
import { IProject, ITask, SortDirection } from '../interfaces';


export const taskService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  updateTask: async (task: ITask) => {
    console.info('Updating task ', task.name);

    // @ts-ignore -> When deleting "subtasks", subtasks is not a required property anymore since it can be undefined...
    delete task.subtasks; // we don't send this to the server!!

    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task/${ task.id }`,
        method: 'PUT',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from PUT', response);
        showToast('success', response.data.message);
      });
    } catch (e) {
      handleError('Error on update task: ' + e.response.data.message, e);
    }
  },

  addTask: async (task: ITask) => {
    console.info('Adding task ', task.name);

    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task`,
        method: 'POST',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from POST', response);
        showToast('success', response.data.message);
        return response.data.taskId;
      });
    } catch (e) {
      handleError('Error on save task: ' + e.response.data.message, e);
    }
  },

  deleteTask: async (task: ITask) => {
    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task/${ task.id }`,
        method: 'DELETE',
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from DELETE', response);
        showToast('success', response.data.message);
      });
    } catch (e) {
      handleError('Error on delete task: ' + e.response.data.message, e);
    }
  },

  getTasksForProject: (projectKey: IProject['id'], sort: IProject['sort'], done: (tasks: ITask[]) => any) => {
    const [sortField, sortDirection] = sort.split(',');
    try {
      return taskService.db
        .collection(`/projects/${ projectKey }/tasks`)
        .orderBy('level', 'desc')
        .orderBy(sortField, sortDirection as SortDirection)
        .onSnapshot((tasksDoc) => {
          const tasks: any = {};
          tasksDoc.forEach((taskDoc) => {
            const id = taskDoc.id;
            const task: any = taskDoc.data();
            const parentId = task.parentId || 'root_task';

            tasks[parentId] = tasks[parentId] || [];
            tasks[parentId].push({
              id,
              ...task,
              projectId: projectKey,
              timestamp: time(task.timestamp.seconds * 1000),
              subtasks: tasks[id] || []
            });
            delete tasks[id];
          });
          done(tasks['root_task'] || []);
        });
    } catch (e) {
      handleError('Error on fetching tasks: ', e);
    }
  },

  toggleTask: (task: ITask) => {
    try {
      return taskService.db
        .doc(`/projects/${ task.projectId }/tasks/${ task.id }`)
        .update({
          checked: task.checked,
          expanded: task.expanded
        });
    } catch (e) {
      handleError('Error on updating "checked" task: ', e);
    }
  },

  searchTask: (searchTerm: string) => {
    try {
      return taskService.db
        .collectionGroup('tasks')
        // @ts-ignore
        .where('_uids', 'array-contains', auth().currentUser.uid)
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
      handleError('Error on searching tasks: ', e);
    }
  }

};
