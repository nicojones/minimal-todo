import React, { useContext } from 'react';
import UserSettingsDropdown from 'components/Dropdown/UserSettingsDropdown';
import './_navbar.scss';
import { text } from 'config/text';
import Tooltip from '../Tooltip/Tooltip';
import { urls } from '../../config/urls';
import NavbarSearch from './NavbarSearch';
import { ProjectDispatch } from 'TodoApp';

function Navbar ({ setShowSidebar, showSidebar }) {

  const projectDispatch = useContext(ProjectDispatch);

  return (
    <>
      <button className="todo-navbar__button btn"><i className="material-icons"
        onClick={ () => setShowSidebar(!showSidebar) }>menu</i></button>
      <div className={ 'todo-navbar ' + ( showSidebar ? 'open' : 'closed' ) }>
        <nav className="navbar-hide">
          <div className="nav-wrapper">
            <button className="navbar-btn btn left" data-tip={ text.menu.menu }
              onClick={ () => setShowSidebar(!showSidebar) }>
              <i className="material-icons">menu</i>
            </button>
            <button className="navbar-btn btn left" onClick={ () => projectDispatch({ id: urls.inboxUrl }) }>
              <i className="material-icons">home</i>
            </button>
            <NavbarSearch/>
            <ul className="navbar-right">
              <li>
                <UserSettingsDropdown/>
              </li>
            </ul>
            {/*<ul className="right hide-on-med-and-down">*/ }
            {/*  <li><a href="sass.html">Sass</a></li>*/ }
            {/*  <li><a href="badges.html">Components</a></li>*/ }
            {/*  <li><a href="collapsible.html">Javascript</a></li>*/ }
            {/*  <li><a href="mobile.html">Mobile</a></li>*/ }
            {/*</ul>*/ }
          </div>
        </nav>
      </div>
      <Tooltip/>
    </>
  );
}

export default Navbar;
