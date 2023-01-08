import {Identifiable} from "./identifiable.interface";
import {ITask} from "./task.interface";

export interface IProject<DateType = number> extends Identifiable<DateType, string | number> {
  empty: boolean;
  sort: string;
  showCompleted: boolean;
  name: string;
  color: string;
  adminEmail: string;
  shared: boolean;
  icon: string;
  tasks: ITask['id'][];
}
