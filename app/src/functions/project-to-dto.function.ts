import {IProject} from "../interfaces";
import {stringTimestamp} from "./string-timestamp.function";

export const projectToDto = (project: IProject): IProject<string> => {
  return {
    ...project,
    created: stringTimestamp(project.created),
    updated: stringTimestamp(project.updated),
  };
}
