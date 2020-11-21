import React, { useState } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Signup from './login/Signup';
import Login from './login/Login';
import TodoApp from './TodoApp';
import { authService } from './services/authService';
import Loader from './components/Loader/Loader';

// export const LoginContext = React.createContext({});

function App () {

  const [loaded, setLoaded] = useState(false);

  authService.authState((user) => {
    console.info('User state changed', user && user.refreshToken);
    setLoaded(true);
  });

  return (
    <>
      { loaded
        ? <Router>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */ }
          <Switch>
            <Route path="/signup">
              <Signup/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/app">
              <TodoApp/>
            </Route>
          </Switch>
        </Router>
        : <Loader/>
      }
    </>
  );
}

export default App;
