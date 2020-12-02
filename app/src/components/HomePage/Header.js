import React, { useContext, useMemo, useState } from 'react';
import { LoggedInUserContext } from 'App';
import { text } from 'config/text';
import { urls } from 'config/urls';
import todoLogo from 'assets/logo.png';
import { Link } from 'react-router-dom';
import './_header.scss';
import HeaderLinks from './HeaderLinks';

function Header ({ loaded }) {

  const user = useContext(LoggedInUserContext);

  const [showMenu, setShowMenu] = useState(false);

  const link = useMemo(() => {
    if (!loaded) {
      return <><a className="btn main-btn goto-app">&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;</a></>;
    }
    if (user) {
      return <Link className="btn main-btn goto-app" to={ urls.app }>{ text.gotoApp }</Link>;
    }
    // else
    return <>
      <Link className="btn main-btn goto-app" to={ urls.login }>{ text.login.login }</Link>
      <Link className="btn" to={ urls.signup }>{ text.login.signup }</Link>
    </>;

  }, [user, loaded]);



  return (
    <>
      <header className="header-area">
        <div className="navbar-area headroom">
          <nav className="navbar">
            <button
              className="hide-lg navbar-toggler btn" type="button" aria-label="Toggle navigation"
              onClick={ () => setShowMenu(!showMenu) }
            >
              <i className="material-icons medium">menu</i>
            </button>
            <a className="navbar-brand" href={ urls.home }>
              <img src={ todoLogo } alt="Logo" height="100%"/>
            </a>

            <div className="navbar-links">
              <HeaderLinks/>
            </div>

            { link }
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
