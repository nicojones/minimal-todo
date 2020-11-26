import { db, auth } from './firebase';
import axios from 'axios';
import environment from './environment';
import { handleError } from './handleError';
import cogoToast from 'cogo-toast';
import { defaultToast } from '../config/defaultToast';

const projectService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  getProject: (projectKey, done) => {
    try {
      return projectService.db
        .doc(`/projects/${ projectKey }`)
        .onSnapshot((doc) => {
          const project = doc.data();
          project.id = doc.id;

          console.info(`Changed to project "${ project.name }"`);

          done(project);
        });
    } catch (e) {
      handleError('Error on fetching Project: ', e);
    }
  },

  getListOfProjects: (done) => {
    try {
      return projectService.db
        .collection(`/projects`)
        .where('uids', 'array-contains', auth().currentUser.uid)
        // .orderBy('timestamp', 'desc')
        .onSnapshot((projectsDoc) => {

          const projects = [];
          projectsDoc.forEach((doc) => {
            const projectData = doc.data();
            const tasks = Object.values(projectData.tasks || '' /* empty object actually... */);
            const completedTasks = tasks.filter((t) => t.checked).length;
            const openTasks = tasks.length - completedTasks;
            projects.push({
              id: doc.id,
              name: projectData.name,
              shared: projectData.shared,
              openTasks,
              completedTasks
            });
          });

          // done([...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects]);
          done(projects);

          console.info('Lists loaded: ', projects.length);
        });
    } catch (e) {
      handleError('Error on fetching tasks: ', e);
    }
  },

  saveListName: async (project) => {
    console.info('Updating project ', project);

    try {
      return await axios({
        url: environment.url + `/project/${ project.id }`,
        method: 'PUT',
        data: project,
        headers: projectService.headers()
      }).then((result) => {
        cogoToast.success(result.data.message, defaultToast);
        console.info('result from Edit Project PUT', result);
      });
    } catch (e) {
      handleError('Error on save project name: ', e);
    }
  },

  newProject: async (project) => {
    try {
      return await axios({
        url: environment.url + `/project`,
        method: 'POST',
        data: project,
        headers: projectService.headers()
      }).then((result) => {
        cogoToast.success(result.data.message, defaultToast);
        console.info(result);
        return result.data.project;
      });
    } catch (e) {
      handleError('Error on create project: ', e);
    }
  },

  deleteProject: async (project) => {
    try {
      return await axios({
        url: environment.url + `/project/${ project.id }`,
        method: 'DELETE',
        headers: projectService.headers()
      }).then((result) => {
        cogoToast.success(result.data.message, defaultToast);
        console.info('result from project DELETE', result);
      });
    } catch (e) {
      handleError('Error on delete project: ', e);
    }
  },

  getUserByEmail: async (userEmail) => {
    try {
      return await axios({
        url: environment.url + `/user/search/`,
        method: 'POST',
        data: { email: userEmail },
        headers: projectService.headers(),
      }).then((result) => {
        return result.data.user;
      });
    } catch (e) {
      handleError('Error on searching email: ', e);
    }
  },

  addUserToProject: async (project, username) => {
    try {
      return await axios({
        url: environment.url + `/project/${ project.id }/join`,
        method: 'POST',
        headers: projectService.headers(),
        data: { username: username }
      }).then((result) => {
        cogoToast.success(result.data.message, defaultToast);
        console.info('result from joining Project', result);
      });
    } catch (e) {
      handleError('Error on joining project: ', e);
    }
  }
};

export default projectService;
