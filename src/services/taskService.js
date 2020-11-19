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
    console.log('Adding task ', task.name);

    try {
      return await db.ref(`${ taskService.path }/tasks`).push(task);
    } catch (e) {
      console.error('Error on save task: ', e);
    }
  },

  deleteTask: async (task) => {
    console.log('Deleting task ', task.name);

    try {
      await db.ref(`${ taskService.path }/tasks/${ task.key }`).remove(() => {
        console.log(`"${ task.name }" was removed!`);
      });
    } catch (e) {
      console.error('Error on delete task: ', e);
    }
  },

  getProject: (projectKey, done) => {
    taskService.path = `lists/${ user }/${ projectKey }`;

    try {
      return db.ref(taskService.path).on('value', (snapshot) => {

        const projectName = snapshot.child('name').val();

        const project = {
          key: snapshot.key,
          name: projectName,
          tasks: []
        };

        snapshot.child('tasks').forEach((task) => {
          project.tasks.push({
            key: task.key,
            subtasks: [],
            ...task.val(),
          });
        });

        done(project);

      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  },

  getProjects: (done) => {
    try {
      return db.ref(`lists/${ user }`).on('value', (snapshot) => {

        const projects = [];
        snapshot.forEach((project) => {
          const projectData = project.val();
          const tasks = Object.values(projectData.tasks || '' /* empty object actually... */);
          const completedTasks = tasks.filter((t) => t.checked).length;
          const openTasks = tasks.length - completedTasks;
          projects.push({
            key: project.key,
            name: projectData.name,
            openTasks,
            completedTasks
          });
        });

        done(projects);

        console.log('Lists loaded: ', projects.length);
      });
    } catch (e) {
      console.error('Error on fetching tasks: ', e);
    }
  },

  saveListName: async (projectName) => {
    console.log('Updating list name ', projectName);

    try {
      return await db.ref(`${ taskService.path }`).update({ name: projectName });
    } catch (e) {
      console.error('Error on save name: ', e);
    }
  },

  newProject: async (projectName) => {
    try {
      return await db.ref(`lists/${ user }`).push({ name: projectName });
    } catch (e) {
      console.error('Error on create project: ', e);
    }
  },

  deleteProject: async (project) => {
    try {
      console.log('Deleting project ', project.name);
      return await db.ref(`lists/${ user }/${ project.key }`).remove();
    } catch (e) {
      console.error('Error on delete project: ', e);
    }
  }
};

export default taskService;
