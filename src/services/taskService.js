import { db } from './firebase';

const user = 'nicoemailcom';

const taskService = {

  db: db,

  path: '',

  updateTask: async (task) => {
    console.log('Updating task ', task.name);
    try {
      return await db.ref(`${ taskService.path }/tasks/${ task.key }`).update(task);
    } catch (e) {
      console.error('Error on update: ', e);
    }
  },

  addTask: async (task) => {
    console.log('Added task ', task.name);
    try {
      return await db.ref(`${ taskService.path }/tasks`).push(task);
    } catch (e) {
      console.error('Error on save: ', e);
    }
  },

  deleteTask: async (task, tasks) => {
    console.log('Deleting task ', task.name);
    const index = tasks.findIndex((_task) => _task.key === task.key);
    if (index >= 0) {
      await db.ref(`${ taskService.path }/tasks/${ task.key }`).remove(() => {
        console.log(`"${ task.name }" was removed!`);
      });
    }
  },

  getTasks: (listKey, done) => {
    taskService.path = `lists/${ user }/${ listKey }`;

    try {
      return db.ref(taskService.path).on('value', (snapshot) => {

        const listName = snapshot.child('name').val();

        const list = {
          key: snapshot.key,
          name: listName,
          tasks: []
        };

        snapshot.child('tasks').forEach((task) => {
          list.tasks.push({
            key: task.key,
            subtasks: [],
            ...task.val(),
          });
        })

        done(list);

        console.log('List with tasks loaded: ', list.tasks.length);
      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  },

  getLists: (done) => {
    try {
      return db.ref(`lists/${ user }`).on('value', (snapshot) => {

        const lists = [];
        snapshot.forEach((list) => {
          const listData = list.val();
          const tasks = Object.values(listData.tasks || '' /* empty object actually... */);
          const completedTasks = tasks.filter((t) => t.checked).length;
          const openTasks = tasks.length - completedTasks;
          lists.push({
            key: list.key,
            name: listData.name,
            openTasks,
            completedTasks
          });
        })

        done(lists);

        console.log('Lists loaded: ', lists.length);
      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  },

  saveListName: async (listName) => {
    console.log('Updating list name ', listName);

    try {
      return await db.ref(`${ taskService.path }`).update({ name: listName });
    } catch (e) {
      console.error('Error on save name: ', e);
    }
  },

  newProject: async (listName) => {
    try {
      return await db.ref(`lists/${ user }`).push({ name: listName });
    } catch (e) {
      console.error('Error on create project: ', e);
    }
  }
};

export default taskService;
