import {pbClient} from './firebase';
import axios from 'axios';
import {environment} from './environment';
import {showToast} from './toast';
import {IProject, PbItem} from '../interfaces';
import {authService} from "./auth.service";
import {constants} from "../config";
import {projectToDto} from "../functions/project-to-dto.function";


export const projectService = {

  headers: () => {
    return {authorization: localStorage.getItem(constants.storageKey.AUTH_TOKEN)};
  },

  getListOfProjects: (
    done: (projects: PbItem<IProject>[]) => any,
    realtime: boolean = true
  ): (() => any) => {
    try {
      pbClient.records.getFullList('projects', 200 /* batch size */, {
        sort: '-created',
        filter: ''
      })
        .then((p) => {
          done(p as unknown as PbItem<IProject>[])
        })
    } catch (e) {
      authService.handleError(e.response.data.message, e);
    }

    if (realtime) {
      pbClient.realtime.subscribe(`projects`, () => {
        projectService.getListOfProjects(done, false);
      });
    }
    return () => pbClient.realtime.unsubscribe(`projects`);
  },

  updateProject: async (project: IProject) => {

    try {
      return pbClient.records.update('projects', project.id, projectToDto(project));
    } catch (e) {
      authService.handleError(e.response.data.message, e);
    }
  },

  newProject: async (project: IProject): Promise<PbItem<IProject> | void> => {
    try {
      return pbClient.records.create('projects', projectToDto(project)) as unknown as Promise<PbItem<IProject>>;
    } catch (e) {
      authService.handleError('Error adding project', e);
    }
  },

  deleteProject: async (project: IProject) => {
    try {
      pbClient.records.delete('projects', project.id);
    } catch (e) {
      authService.handleError('Error deleting project', e);
    }
  },

  deleteProjectTasks: async (project: IProject) => {
    try {
      return await axios({
        url: environment.url + `/project/${project.id}/only-tasks`,
        method: 'DELETE',
        headers: projectService.headers()
      }).then((result) => {
        showToast('success', result.data.message);
        console.info('result from project task DELETE', result);
      });
    } catch (e) {
      authService.handleError(e.response.data.message, e);
    }
  },

  getUserByEmail: async (userEmail: string) => {
    try {
      return await axios({
        url: environment.url + `/user/search/`,
        method: 'POST',
        data: {email: userEmail},
        headers: projectService.headers(),
      }).then((result) => {
        return result.data.user;
      });
    } catch (e) {
      authService.handleError(e.response.data.message, e);
    }
  },

  addUserToProject: async (project: IProject, username: string) => {
    try {
      return await axios({
        url: environment.url + `/project/${project.id}/join`,
        method: 'POST',
        headers: projectService.headers(),
        data: {username: username}
      }).then((result) => {
        showToast('success', result.data.message);
        console.info('result from joining Project', result);
      });
    } catch (e) {
      authService.handleError(e.response.data.message, e);
    }
  }
};
