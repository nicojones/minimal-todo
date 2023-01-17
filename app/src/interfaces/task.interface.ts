import {IProject} from './project.interface';
import {Identifiable} from "./identifiable.interface";


export interface ITask<DateType = string> extends Identifiable<DateType> {
  name: string;
  description: string;
  url: string;
  notes: string;
  tags: string[] | [];
  starred: boolean;
  backgroundColor: string | null;
  done: boolean;
  expanded: boolean;
  subtasks: ITask<DateType>[];
  level: number;
  alert: number;
  deadline: number;
  priority: number;
  parent_id: ITask['id'];
  created: DateType;
  updated: DateType;
  project_id: IProject['id'];
  projectName: string;
  icon: string;
  dotColor: string;
}
