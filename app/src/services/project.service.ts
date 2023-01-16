import { serverError } from "functions/server-error.function";
import { Observable } from "rxjs";
import { projectToDto } from "../functions/project-to-dto.function";
import {
  IProject,
  IUser,
  UserSearchResults
} from "../interfaces";
import { minimalAxios } from "./axios.service";

export class ProjectService {
  public static getListOfProjects = (): Observable<IProject[]> => {
    return minimalAxios<IProject[]>("GET", "/api/projects").pipe(
      serverError<IProject[]>([], "Error fetching projects")
    );
  };

  public static updateProject = (
    project: IProject
  ): Observable<IProject | void> => {
    return minimalAxios<IProject>("PUT", "/api/projects", {
      body: project,
      error: "Error updating project",
    });
  };

  public static newProject = (
    project: IProject
  ): Observable<IProject | void> => {
    return minimalAxios<IProject>("POST", "/api/projects", {
      body: projectToDto(project),
      error: "Error adding project",
    });
  };

  public static deleteProject = (project: IProject): Observable<void> => {
    return minimalAxios<void>("DELETE", `/api/projects/${project.id}`, {
      error: "Error deleting project",
    });
  };

  public static deleteProjectTasks = (project: IProject): Observable<void> => {
    return minimalAxios<void>(
      "DELETE",
      `/api/tasks/${project.id}/all-tasks`,
      { error: "Error deleting project tasks" }
    );
  };

  public static getUsersByEmail = (
    userEmail: string,
    exclude: string = ""
  ): Observable<UserSearchResults[]> => {
    return minimalAxios<UserSearchResults[]>(
      "GET",
      `/api/users/search?q=${userEmail}&exclude=${exclude}`,
      { error: "Error getting users by email", default: [] }
    );
  };

  public static addUserToProject = (
    project: IProject,
    userId: IUser["id"]
  ): Observable<void> => {
    return minimalAxios<void>(
      "POST",
      `/api/projects/${project.id}/join?id=${userId}`,
      { error: `Error adding user to ${project.name}` }
    );
  };

  public static removeUserFromProject = (
    project: IProject,
    userId: IUser["id"]
  ): Observable<void> => {
    return minimalAxios<void>(
      "DELETE",
      `/api/projects/${project.id}/users?id=${userId}`,
      {error: `Error removing user from ${project.name}`}
    );
  };

  public static getProjectUsers = (
    project: IProject
  ): Observable<UserSearchResults[]> => {
    return minimalAxios<UserSearchResults[]>(
      "GET",
      `/api/projects/${project.id}/users`,
      {error: `Error getting users for ${project.name}`, default: []}
    );
  };
}
