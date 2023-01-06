import { AxiosResponse } from 'axios';
import { showToast } from './toast';
import { CaughtPromise, IProject, IUser, UserSearchResults } from '../interfaces';
import { AuthService } from "./auth.service";
import { text } from "../config";
import { projectToDto } from "../functions/project-to-dto.function";
import { minimalAxios } from './axios.service';


export class ProjectService {

  public static getListOfProjects = (): Promise<IProject[]> => {
    return minimalAxios.get("/api/projects")
      .then((response: AxiosResponse<IProject[]>) => {
        return response.data
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, e.response.message);
        return [];
      });
  }

  public static updateProject = (project: IProject): Promise<IProject | void> => {
    return minimalAxios.put(
      `/api/projects`,
      project
    )
      .then((response: AxiosResponse<IProject>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, 'Error adding project');
      });
  }

  public static newProject = (project: IProject): Promise<IProject | void> => {
    return minimalAxios.post(
      '/api/projects',
      projectToDto(project)
    )
      .then((response: AxiosResponse<IProject>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, 'Error adding project');
      });
  }

  public static deleteProject = (project: IProject): Promise<void> => {
    return minimalAxios.delete(
      `/api/projects/${project.id}`
    )
      .then((response: AxiosResponse<void>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, 'Error deleting project')
      })
  }

  public static deleteProjectTasks = (project: IProject): Promise<void> => {
    return minimalAxios({
      url: `/api/tasks/for-project/${project.id}`,
      method: 'DELETE',
    })
      .then((result) => {
        showToast('success', result.data.message);
        console.info('result from project task DELETE', result);
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
      })
  }

  public static getUsersByEmail = (userEmail: string): Promise<UserSearchResults[]> => {
    return minimalAxios.get(
      `/api/users/search?q=${userEmail}`,
    )
      .then((result: AxiosResponse<UserSearchResults[]>) => {
        return result.data;
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
        return [];
      })
  }

  public static addUserToProject = (project: IProject, userEmail: string): Promise<void> => {
    return minimalAxios.post(
      `/api/projects/${project.id}/join?user=${userEmail}`,
    )
      .then((result: AxiosResponse<void>) => {
        showToast('success', text.project.add.u);
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
      })
  }
};
