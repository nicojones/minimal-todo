import {Identifiable} from "./identifiable.interface";
import {ITask} from "./task.interface";

export interface MinimalProject<DateType = number> extends Identifiable<DateType, string | number> {
  name: string;
  color: string;
  icon: string;
}

export interface IProject<DateType = number> extends MinimalProject<DateType> {
  empty: boolean;
  sort: string;
  showCompleted: boolean;
  adminEmail: string;
  shared: boolean;
  tasks: ITask['id'][];
}
