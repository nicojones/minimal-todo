import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { TodoApp } from "TodoApp";
import { Signup } from "components/Login/Signup";
import { Login } from "components/Login/Login";
import { LandingPage } from "components/HomePage/LandingPage";
import { NotFound } from "components/NotFound/NotFound";
import { urls } from "config";
import { ILoggedInUserContext, IUser } from "./interfaces";
import { Toaster } from "react-hot-toast";
import { AuthService } from "services";
import { Routing } from "Routing";

export const LoggedInUserContext = React.createContext<ILoggedInUserContext>({
  user: null,
  setUser: () => {},
});

export const App = () => {
  const [user, setUser] = useState<IUser | null>(AuthService.currentUser());

console.log("TTTT", AuthService.currentUser());
  return (
    <>
      <div>
        <Toaster position="bottom-center" />
      </div>
      <LoggedInUserContext.Provider value={{ user, setUser }}>
        {/* { user
          ? */}
        <Router>
          <Routing />
        </Router>
        {/* : <Loader/> */}
        {/* } */}
      </LoggedInUserContext.Provider>
    </>
  );
};
