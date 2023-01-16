import {IProject} from './project.interface';
import {Identifiable} from "./identifiable.interface";


export interface ITask<DateType = string> extends Identifiable<DateType> {
  name: string;
  description: string;
  done: boolean;
  expanded: boolean;
  subtasks: ITask<DateType>[];
  level: number;
  priority: number;
  parent_id: ITask['id'];
  created: DateType;
  updated: DateType;
  project_id: IProject['id'];
  projectName: string;
  icon: string;
  dotColor: string;
}
