import {Identifiable} from "./identifiable.interface";
import {ITask} from "./task.interface";

export interface IProject<DateType = number> extends Identifiable<DateType> {
  empty: boolean;
  sort: string;
  showCompleted: boolean;
  name: string;
  color: string;
  shared: boolean;
  tasks: ITask['id'][];
}
