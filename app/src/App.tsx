import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { authService } from 'services/auth.service';
import { TodoApp } from 'TodoApp';
import { Signup } from 'components/Login/Signup';
import { Loader } from 'components/Loader/Loader';
import { Login } from 'components/Login/Login';
import { LandingPage } from 'components/HomePage/LandingPage';
import { NotFound } from 'components/NotFound/NotFound';
import { urls } from 'config';
import { IUser } from './interfaces';


export const LoggedInUserContext = React.createContext<IUser>({} as IUser);


export function App () {

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<IUser>(false as unknown as IUser);

  authService.authState((user: IUser) => {
    console.info(`User is ${ user ? '' : 'NOT ' }logged in`);
    setUser(user);
    setLoaded(true);
  });

  return (
    <>
      <LoggedInUserContext.Provider value={ user }>
        { loaded
          ?
          <>
            <Router>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */ }
              <Switch>
                <Route path={ urls.home } exact={ true }>
                  <LandingPage/>
                </Route>
                <Route exact path={ urls.signup } component={ Signup }/>
                <Route exact path={ urls.login } component={ Login }/>
                <Route exact path={ `${ urls.project(':projectId?') }` } component={ TodoApp }/>
                <Route component={ NotFound }/>
              </Switch>
            </Router>
          </>
          : <Loader/>
        }
      </LoggedInUserContext.Provider>
    </>
  );
}
