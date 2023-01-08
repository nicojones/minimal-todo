import { AxiosResponse } from "axios";
import { text } from "../config";
import { projectToDto } from "../functions/project-to-dto.function";
import {
  CaughtPromise,
  IProject,
  UserSearchResults as UserSearchResult
} from "../interfaces";
import { AuthService } from "./auth.service";
import { minimalAxios } from "./axios.service";
import { showToast } from "./toast";

export class ProjectService {
  public static getListOfProjects = (): Promise<IProject[]> => {
    return minimalAxios
      .get("/api/projects")
      .then((response: AxiosResponse<IProject[]>) => {
        return response.data;
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, e.response.message);
        return [];
      });
  };

  public static updateProject = (
    project: IProject
  ): Promise<IProject | void> => {
    return minimalAxios
      .put(`/api/projects`, project)
      .then((response: AxiosResponse<IProject>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, "Error adding project");
      });
  };

  public static newProject = (project: IProject): Promise<IProject | void> => {
    return minimalAxios
      .post("/api/projects", projectToDto(project))
      .then((response: AxiosResponse<IProject>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, "Error adding project");
      });
  };

  public static deleteProject = (project: IProject): Promise<void> => {
    return minimalAxios
      .delete(`/api/projects/${project.id}`)
      .then((response: AxiosResponse<void>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, "Error deleting project");
      });
  };

  public static deleteProjectTasks = (project: IProject): Promise<void> => {
    return minimalAxios
      .delete(`/api/projects/${project.id}/all-tasks`)
      .then((result) => {
        showToast("success", text.task.delete.allDeleted);
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
      });
  };

  public static getUsersByEmail = (
    userEmail: string
  ): Promise<UserSearchResult[]> => {
    return minimalAxios
      .get(`/api/users/search?q=${userEmail}`)
      .then((result: AxiosResponse<UserSearchResult[]>) => {
        return result.data;
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
        return [];
      });
  };

  public static addUserToProject = (
    project: IProject,
    userEmail: string
  ): Promise<void> => {
    return minimalAxios
      .post(`/api/projects/${project.id}/join?email=${userEmail}`)
      .then((result: AxiosResponse<void>) => {
        showToast("success", text.project.add.u(userEmail));
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
      });
  };

  public static removeUserFromProject = (
    project: IProject,
    userEmail: string
  ): Promise<void> => {
    return minimalAxios
      .delete(`/api/projects/${project.id}/users?email=${userEmail}`)
      .then((result: AxiosResponse<void>) => {
        showToast("success", text.project.remove.u(userEmail));
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
      });
  };

  public static getProjectUsers = (
    project: IProject
  ): Promise<UserSearchResult[]> => {
    return minimalAxios
      .get(`/api/projects/${project.id}/users`)
      .then((result: AxiosResponse<UserSearchResult[]>) => {
        return result.data;
      })
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e);
        return [];
      });
  };
}
