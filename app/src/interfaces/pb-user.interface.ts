import {PbItem} from "./pb-result.interface";
import {Identifiable} from "./identifiable.interface";
import {IUser} from "./user.interface";

export interface PbUser<DateType = string> extends Identifiable<DateType>, IUser<DateType> {
  lastResetSentAt: DateType;
  lastVerificationSentAt: DateType;
  verified: boolean;
  profile: PbItem<{ name: string, avatar: string }>
}
