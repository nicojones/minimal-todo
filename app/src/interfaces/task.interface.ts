import { IProject } from './project.interface';


export interface ITask {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  expanded: boolean;
  subtasks: ITask[];
  level: number;
  priority: number;
  parentId: ITask['id'];
  timestamp: {
    seconds: number;
  } | Date;
  projectId: IProject['id'];
}
