import {Identifiable} from "./identifiable.interface";

export interface IUser<DateType = number> extends Identifiable<DateType> {
  email: string;
}
