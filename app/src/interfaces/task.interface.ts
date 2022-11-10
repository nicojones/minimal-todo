import {IProject} from './project.interface';
import {Identifiable} from "./identifiable.interface";


export interface ITask<DateType = number> extends Identifiable<DateType> {
  name: string;
  description: string;
  done: boolean;
  expanded: boolean;
  subtasks: ITask<DateType>[];
  level: number;
  priority: number;
  parentId: ITask['id'];
  timestamp: DateType;
  project: IProject['id'];
}
