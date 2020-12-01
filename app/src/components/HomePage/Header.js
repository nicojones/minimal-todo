import React, { useContext, useMemo, useState } from 'react';
import { LoggedInUserContext } from 'App';
import { text } from 'config/text';
import { urls } from 'config/urls';
import todoLogo from 'assets/logo.png';
import { useHistory } from 'react-router-dom';
import './_header.scss';
import HeaderLinks from './HeaderLinks';

function Header ({ loaded }) {

  const user = useContext(LoggedInUserContext);
  const history = useHistory();

  const [showMenu, setShowMenu] = useState(false);

  const link = useMemo(() => {
    if (!loaded) {
      return <></>;
    }
    if (user) {
      return <a className="btn btn-flat main-btn red" onClick={ () => history.push(urls.app) }>{ text.gotoApp }</a>;
    }
    // else
    return <>
      <a className="btn btn-flat main-btn red" onClick={ () => history.push(urls.login) }>{ text.login.login }</a>
      <a className="btn btn-flat" onClick={ () => history.push(urls.signup) }>{ text.login.signup }</a>
    </>;

  }, [user, loaded]);



  return (
    <>
      <header className="header-area">
        <div className="navbar-area headroom">
          <nav className="navbar">
            <button
              className="hide-lg navbar-toggler btn-invisible" type="button" aria-label="Toggle navigation"
              onClick={ () => setShowMenu(!showMenu) }
            >
              <i className="material-icons">menu</i>
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
