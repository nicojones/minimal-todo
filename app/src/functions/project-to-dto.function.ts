import {IProject} from "../interfaces";
import {stringTimestamp} from "./string-timestamp.function";

export const projectToDto = (project: IProject): IProject => {
  return {
    ...project
  };
}
