import { db } from './firebase';

const taskService = {

  updateTask: async (task) => {
    console.log('Updating task ', task.name);
    try {
      return await db.ref(`todos/${ task.key }`).update(task);
    } catch (e) {
      console.error('Error on update: ', e);
    }
  },

  addTask: async (task) => {
    console.log('Added task ', task.name);
    try {
      return await db.ref('todos').push(task);
    } catch (e) {
      console.error('Error on save: ', e);
    }
  },

  deleteTask: async (task, tasks) => {
    console.log('Deleting task ', task.name);
    const index = tasks.findIndex((_task) => _task.key === task.key);
    if (index >= 0) {
      await db.ref(`todos/${ task.key }`).remove(() => {
        console.log(`"${ task.name }" was removed!`);
      });
    }
  },

  getTasks: (taskSetter, showLoader) => {
    try {
      return db.ref('todos').on('value', (snapshot) => {
        const tasks = [];
        snapshot.forEach((snap) => {
          tasks.push({
            ...snap.val(),
            key: snap.key
          });
        });
        taskSetter(tasks);
        showLoader(false);

        console.log('Tasks loaded: ', tasks.length)
      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  }
};

export default taskService;
