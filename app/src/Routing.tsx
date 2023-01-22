import { LoggedInUserContext } from "App";
import { TodoApp } from "TodoApp";
import { LandingPage } from "components/HomePage/LandingPage";
import { Login } from "components/Login/Login";
import { Signup } from "components/Login/Signup";
import { NotFound } from "components/NotFound/NotFound";
import { Settings } from "components/Settings/Settings";
import { urls } from "config";
import { ILoggedInUserContext } from "interfaces";
import { useContext, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

export const Routing = () => {
  const history = useHistory();

  const { user } = useContext<ILoggedInUserContext>(LoggedInUserContext);

  useEffect(() => {
    // If the user is logged in already, redirect to the app!
    if (user && !history.location.pathname.startsWith(urls.app)) {
    //   history.push(urls.app);
    }
  }, []);

  return (
    <>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path={urls.home} exact={true}>
          <LandingPage />
        </Route>
        <Route exact path={urls.signup} component={Signup} />
        <Route exact path={urls.login} component={Login} />
        <Route
          exact
          path={`${urls.project(":projectId?")}`}
          component={TodoApp}
        />
        <Route exact path={urls.settings} component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};
