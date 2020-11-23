import { db } from './firebase';
import axios from 'axios';
import environment from './environment';
import { handleError } from './handleError';
import cogoToast from 'cogo-toast';
import { defaultToast } from '../config/defaultToast';

const taskService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  updateTask: async (projectKey, task) => {
    console.info('Updating task ', task.name);

    try {
      return await axios({
        url: environment.url + `/project/${ projectKey }/task/${ task.id }`,
        method: 'PUT',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from PUT', response);
        cogoToast.success(response.data.message, defaultToast);
      });
    } catch (e) {
      handleError('Error on save task: ', e);
    }
  },

  addTask: async (projectKey, task) => {
    console.info('Adding task ', task.name);

    try {
      return await axios({
        url: environment.url + `/project/${ projectKey }/task`,
        method: 'POST',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from POST', response);
        cogoToast.success(response.data.message, defaultToast);
      });
      // return await db.ref(`${ taskService.path }/tasks`).push(task);
    } catch (e) {
      handleError('Error on save task: ', e);
    }
  },

  deleteTask: async (projectKey, task) => {
    try {
      return await axios({
        url: environment.url + `/project/${ projectKey }/task/${ task.id }`,
        method: 'DELETE',
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from DELETE', response);
        cogoToast.success(response.data.message, defaultToast);
      });
    } catch (e) {
      handleError('Error on delete task: ', e);
    }
  },

  getTasksForProject: (projectKey, done) => {
    try {
      return taskService.db
        .collection(`/projects/${ projectKey }/tasks`)
        .orderBy('timestamp', 'desc')
        .onSnapshot((tasksDoc) => {
        const tasks = [];
        tasksDoc.forEach((task) => {
          tasks.push({
            id: task.id,
            ...task.data()
          });
        });
        done(tasks);
      });
    } catch (e) {
      handleError('Error on fetching tasks: ', e);
    }
  },

  toggleTask: (projectId, task) => {
    try {
      return taskService.db
        .doc(`/projects/${ projectId }/tasks/${ task.id }`)
        .update({ checked: task.checked, subtasks: task.subtasks })
    } catch (e) {
      handleError('Error on updating "checked" task: ', e);
    }
  }

};

export default taskService;
