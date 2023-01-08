import { LoggedInUserContext } from "App";
import { HeaderLinks } from "components/HomePage/HeaderLinks";
import { Logo } from "components/Logo/Logo";
import { text, urls } from "config";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./_header.scss";

export const Header = () => {
  const {user} = useContext(LoggedInUserContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header-area">
      <div className="navbar-area headroom">
        <nav className="navbar">
          <button
            className="hide-lg navbar-toggler btn"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="material-icons medium">menu</i>
          </button>
          <a className="navbar-brand" href={urls.home}>
            {/*<img src={ todoLogo } alt="Logo" width="100%"/>*/}
            {text.appName}
          </a>
          <Logo />

          <div className="navbar-links">
            <HeaderLinks className="" />
          </div>

          {user ? (
            <Link className="btn main-btn goto-app" to={urls.app}>
              {text.gotoApp}
            </Link>
          ) : (
            <>
              <span className="relative ml-auto">
                <button
                  className="btn main-btn goto-app"
                  onClick={() => setShowDropdown(true)}
                >
                  {text.gotoApp}
                </button>
                {showDropdown && (
                  <>
                    <ul className="dropdown goto-app-dd">
                      <li className="dropdown-item">
                        <Link className="btn" to={urls.login}>
                          {text.login.login}
                        </Link>
                      </li>
                      <li className="dropdown-item">
                        <Link className="btn" to={urls.signup}>
                          {text.login.signup}
                        </Link>
                      </li>
                    </ul>
                    <div
                      className="backdrop"
                      onClick={() => setShowDropdown(false)}
                    />
                  </>
                )}
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
