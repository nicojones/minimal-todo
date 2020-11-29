import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from 'components/Login/Signup';
import Login from 'components/Login/Login';
import TodoApp from './TodoApp';
import { authService } from './services/authService';
import Loader from './components/Loader/Loader';
import HomePage from './components/HomePage/HomePage';
import { urls } from 'config/urls';

export const LoggedInUserContext = React.createContext({});


function App () {

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(false);

  authService.authState((user) => {
    console.info('User logged in: ', !!user);
    setUser(user);
    setLoaded(true);
  });

  return (
    <>
      <LoggedInUserContext.Provider value={ user }>
        <Router>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */ }
          <Switch>
            <Route path={ urls.home } exact={ true }>
              <HomePage loaded={ loaded }/>
            </Route>
            { loaded
              ?
              <>
                <Route path={ urls.signup } component={ Signup }/>
                <Route path={ urls.login } component={ Login }/>
                <Route path={ `${ urls.project(':projectKeyParam?') }` } component={ TodoApp }/>
              </>
              : <Loader/>
            }
          </Switch>
        </Router>
      </LoggedInUserContext.Provider>
    </>
  );
}

export default App;
