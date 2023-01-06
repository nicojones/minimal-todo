import {LoginUser} from "./login-user.interface";

export interface LoginResponse {
  token: string;
  user: LoginUser;
}
