import {PbItem} from "./pb-result.interface";
import {Identifiable} from "./identifiable.interface";
import {IUser} from "./user.interface";

export interface LoginUser<DateType = number> extends Identifiable<DateType, number>, IUser<DateType, number> {
}
