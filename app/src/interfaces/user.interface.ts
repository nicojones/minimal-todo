import {Identifiable} from "./identifiable.interface";

export interface IUser<DateType = number, ID = number> extends Identifiable<DateType, ID> {
  name: string;
  role: "USER" | "ADMIN";
  username: string; // same as email for now;
  email: string;
}
