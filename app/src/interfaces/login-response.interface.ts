import { LoginUser } from "./login-user.interface";

export interface LoginResponse {
  authorisation: {
    token: string;
    type: "bearer";
  };
  user: LoginUser;
}
