import {PbUser} from "./pb-user.interface";

export interface LoginResponse {
  token: string;
  user: PbUser;
}
