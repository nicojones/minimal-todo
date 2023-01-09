import axios, { AxiosResponse } from "axios";
import { environment } from "./environment";
import { constants } from "config";
import { Observable, catchError, from, of } from "rxjs";
import { CaughtPromise } from "interfaces";
import { AuthService } from "./auth.service";

const defaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};

  // headers.Accept = "application/json";
  if (localStorage.getItem(constants.storageKey.AUTH_TOKEN)) {
    headers.Authorization = localStorage.getItem(
      constants.storageKey.AUTH_TOKEN
    ) as string;
  }

  return headers;
};

export const minimalAxios = <T, BodyType = T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  extra?: { body?: BodyType, error?: string; default?: T | null }
): Observable<T> => {
  return from<Promise<T>>(
    axios
      .create({
        baseURL: environment.url,
        headers: defaultHeaders(),
        withCredentials: true,
        validateStatus: function (status) {
          return [401, 403, 404, 500].indexOf(status) === -1;
        },
      })({ method: method, url: url, data: extra?.body })
      .then((response: AxiosResponse<T>) => response.data)
      .catch((e: CaughtPromise) => {
        AuthService.handleError(e, extra?.error ? `${extra.error}: ${String(e).replace("Error: ", "")}` : String(e));
        console.error(String(e), e);
        return (extra?.default || null) as T;
      })
  );
};
