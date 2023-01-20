import {IProject} from "../interfaces";

export const projectToDto = (project: IProject): IProject => {
  return {
    ...project
  };
}
