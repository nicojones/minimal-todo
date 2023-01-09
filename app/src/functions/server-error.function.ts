import { CaughtPromise } from "interfaces";
import { Observable, UnaryFunction, catchError, of, pipe } from "rxjs";
import { AuthService } from "services";

export const serverError = <T>(
  defaultReturn: T | null,
  message?: string,
): UnaryFunction<Observable<T>, Observable<any>> => {
  return pipe(
    catchError((e: any) => {
      console.log("no error or what?", e);
      AuthService.handleError(e, message || e.response.message);
      return of(defaultReturn);
    })
  );
};
