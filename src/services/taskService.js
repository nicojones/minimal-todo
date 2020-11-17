import { db } from './firebase';

const taskService = {

  updateTask: async (task) => {
    try {
      await db.ref(`todos/${ task.key }`).update(task);
    } catch (e) {
      console.error('Error on update: ', e);
    }
  },

  addTask: async (task) => {
    try {
      await db.ref('todos').push(task);
    } catch (e) {
      console.error('Error on save: ', e);
    }
  },

  deleteTask: async (task, tasks) => {
    const index = tasks.findIndex((_task) => _task.key === task.key);
    if (index >= 0) {
      await db.ref(`todos/${ task.key }`).remove(() => {
        console.log(`"${ task.name }" was removed!`);
      });
    }
  },

  getTasks: async (taskSetter) => {
    try {
      db.ref('todos').on('value', (snapshot) => {
        const tasks = [];
        snapshot.forEach((snap) => {
          tasks.push({
            ...snap.val(),
            key: snap.key
          });
        });
        taskSetter(tasks);
      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  }
};

export default taskService;
