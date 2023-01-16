import { constants } from 'config/constants';
import { IProject } from '../interfaces';


export function createProjectObject (name: IProject['name']): IProject {
  return{
    name: name,
    color: constants.defaultProjectColor,
    sort: constants.defaultSort,
    show_completed: false
  } as IProject;
}

