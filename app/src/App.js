import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from 'components/Login/Signup';
import Login from 'components/Login/Login';
import TodoApp from './TodoApp';
import { authService } from './services/authService';
import Loader from './components/Loader/Loader';
import LandingPage from './components/HomePage/LandingPage';
import { urls } from 'config/urls';
import NotFound from './components/NotFound/NotFound';

export const LoggedInUserContext = React.createContext({});


function App () {

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(false);

  authService.authState((user) => {
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

export default App;
