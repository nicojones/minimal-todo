import { db } from './firebase';
import axios from 'axios';
import environment from './environment';
import { handleError } from './handleError';
import cogoToast from 'cogo-toast';
import { time } from 'functions/time';
import { constants } from 'config/constants';

const taskService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  updateTask: async (task) => {
    console.info('Updating task ', task.name);

    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task/${ task.id }`,
        method: 'PUT',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from PUT', response);
        cogoToast.success(response.data.message, constants.toast);
      });
    } catch (e) {
      handleError('Error on update task: ' + e.response.data.message, e);
    }
  },

  addTask: async (task) => {
    console.info('Adding task ', task.name);

    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task`,
        method: 'POST',
        data: task,
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from POST', response);
        cogoToast.success(response.data.message, constants.toast);
        return response.data.taskId;
      });
    } catch (e) {
      handleError('Error on save task: ' + e.response.data.message, e);
    }
  },

  deleteTask: async (task) => {
    try {
      return await axios({
        url: environment.url + `/project/${ task.projectId }/task/${ task.id }`,
        method: 'DELETE',
        headers: taskService.headers()
      }).then((response) => {
        console.info('result from DELETE', response);
        cogoToast.success(response.data.message, constants.toast);
      });
    } catch (e) {
      handleError('Error on delete task: ' + e.response.data.message, e);
    }
  },

  getTasksForProject: (projectKey, sort, done) => {
    const [sortField, sortDirection] = sort.split(',');
    console.log(projectKey, sort)
    try {
      return taskService.db
        .collection(`/projects/${ projectKey }/tasks`)
        .orderBy('level', 'desc')
        .orderBy(sortField, sortDirection)
        .onSnapshot((tasksDoc) => {
          const tasks = {};
          tasksDoc.forEach((taskDoc) => {
            const id = taskDoc.id;
            const task = taskDoc.data();
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

  toggleTask: (task) => {
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
  }

};

export default taskService;
