import { Identifiable } from "./identifiable.interface";

// export type UserSearchResults = string;


export interface UserSearchResults extends Identifiable {
    email: string;
    name: string;
    is_admin: boolean;
}