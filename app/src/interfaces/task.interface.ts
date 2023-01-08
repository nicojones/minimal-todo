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
  parentId: ITask['id'];
  created: DateType;
  updated: DateType;
  projectId: IProject['id'];
  projectName: string;
  icon: string;
  projectSecret: string;
  dotColor: string;
}
