import { IUser } from "./user.interface";

export interface ILoggedInUserContext {
    user: IUser | null,
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}