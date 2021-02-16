import { auth, db } from './firebase';
import axios from 'axios';
import { environment } from './environment';
import { handleError } from './handle-error';
import { showToast } from './toast';
import { IProject } from '../interfaces';


export const projectService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  getListOfProjects: (done: (projects: IProject[]) => any) => {
    try {
      return projectService.db
        .collection(`/projects`)
        .where('_uids', 'array-contains', (auth().currentUser as any).uid)
        // .orderBy('timestamp', 'desc')
        .onSnapshot((projectsDoc) => {

          const projects: IProject[] = [];
          projectsDoc.forEach((doc) => {
            const projectData = doc.data();
            projects.push({
              id: doc.id,
              name: projectData.name,
              shared: projectData.shared,
              sort: projectData.sort,
              showCompleted: projectData.showCompleted,
              color: projectData.color
            } as IProject);
          });

          // done([...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects]);
          done(projects);

          console.info(`${ projects.length } projects loaded`);
        });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  },

  updateProject: async (project: IProject) => {

    try {
      return await axios({
        url: environment.url + `/project/${ project.id }`,
        method: 'PUT',
        data: project,
        headers: projectService.headers()
      }).then((result) => {
        // showToast('success', result.data.message);
        // console.info('result from Edit Project PUT', result);
      });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  },

  newProject: async (project: IProject) => {
    try {
      return await axios({
        url: environment.url + `/project`,
        method: 'POST',
        data: project,
        headers: projectService.headers()
      }).then((result) => {
        console.log(result);
        showToast('success', result.data.message);
        return result.data.project;
      });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  },

  deleteProject: async (project: IProject) => {
    try {
      return await axios({
        url: environment.url + `/project/${ project.id }`,
        method: 'DELETE',
        headers: projectService.headers()
      }).then((result) => {
        showToast('success', result.data.message);
        console.info('result from project DELETE', result);
      });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  },

  deleteProjectTasks: async (project: IProject) => {
    try {
      return await axios({
        url: environment.url + `/project/${ project.id }/only-tasks`,
        method: 'DELETE',
        headers: projectService.headers()
      }).then((result) => {
        showToast('success', result.data.message);
        console.info('result from project task DELETE', result);
      });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  },

  getUserByEmail: async (userEmail: string) => {
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
      handleError(e.response.data.message, e);
    }
  },

  addUserToProject: async (project: IProject, username: string) => {
    try {
      return await axios({
        url: environment.url + `/project/${ project.id }/join`,
        method: 'POST',
        headers: projectService.headers(),
        data: { username: username }
      }).then((result) => {
        showToast('success', result.data.message);
        console.info('result from joining Project', result);
      });
    } catch (e) {
      handleError(e.response.data.message, e);
    }
  }
};
