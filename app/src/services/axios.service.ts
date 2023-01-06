import axios from "axios";
import { environment } from "./environment";
import { constants } from "config";

const defaultHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    
    // headers.Accept = "application/json";
    console.log("hey", localStorage.getItem(constants.storageKey.AUTH_TOKEN))
    if (localStorage.getItem(constants.storageKey.AUTH_TOKEN)) {
        headers.Authorization = localStorage.getItem(constants.storageKey.AUTH_TOKEN) as string;
    }

    return headers;
}

export const minimalAxios = axios.create({
    baseURL: environment.url,
    headers: defaultHeaders(),
    withCredentials: true,
    validateStatus: function (status) {
        return [401, 403, 404, 500].indexOf(status) === -1
    }
});