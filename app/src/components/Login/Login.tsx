import { LoggedInUserContext } from "App";
import { LoginBox } from "components/Login/LoginBox";
import { text, urls } from "config";
import React, { useContext, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { AuthService } from "services/auth.service";
import { showToast } from "services/toast";
import {
  CaughtPromise,
  ILoginForm,
  LoginUser,
  PDefault,
} from "../../interfaces";
import { Observable, catchError, of, tap } from "rxjs";
import { minimalAxios } from "services/axios.service";

export const Login = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState<ILoginForm>(
    {} as ILoginForm
  );
  const { user, setUser } = useContext(LoggedInUserContext);

  // If the user is logged in already, redirect to the app!
  if (React.useContext(LoggedInUserContext).user) {
    history.push(urls.project(urls.inboxUrl));
    return null;
  }

  const onSubmit = (e: PDefault): Observable<LoginUser | null> => {
    e.preventDefault();

    setLoading(true);

    return AuthService.login(loginFormData).pipe(
      tap((_user: LoginUser | null) => {
        setLoading(false);

        if (_user) {
          setLoginFormData({} as ILoginForm);
          setUser(_user);
          showToast("success", text.login.success(_user.name));
        } else {
          showToast("error", text.login.error);
        }
      }),
      catchError((response: any) => {
        setLoading(false);
        AuthService.loginCatch(response.status);
        return of();
      })
    );
  };

  return user ? (
    <Redirect to={urls.app} />
  ) : (
    <LoginBox data-tip={text.login.login} loading={loading}>
      <form onSubmit={(e: PDefault) => onSubmit(e).subscribe()} className="flex-center-self">
        <div className="form-group">
          <label>{text.login.f.email._}</label>
          <input
            value={loginFormData.email || ""}
            onChange={(e) =>
              setLoginFormData({
                ...loginFormData,
                email: e.target.value,
              })
            }
            placeholder={text.login.f.email.ph}
            type="email"
            autoFocus
            required
          />
        </div>
        <div className="form-group">
          <label>{text.login.f.password._}</label>
          <input
            value={loginFormData.password || ""}
            onChange={(e) =>
              setLoginFormData({
                ...loginFormData,
                password: e.target.value,
              })
            }
            placeholder={text.login.f.password.ph}
            type="password"
            autoComplete="off"
            required
          />
        </div>
        <br />
        <div className="flex-column">
          <button type="submit" className="btn btn-block main-btn">
            {text.login.login}
          </button>
          <hr />
          <Link to={urls.signup} className="no-color u">
            {text.login.noAccount} {text.login.signup}
          </Link>
        </div>
      </form>

    </LoginBox>
  );
};
