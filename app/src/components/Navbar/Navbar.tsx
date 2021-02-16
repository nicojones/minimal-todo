import React, { Dispatch, SetStateAction, useContext } from 'react';
import './_navbar.scss';
import { text, urls } from 'config';
import { NavbarSearch } from 'components/Navbar/NavbarSearch';
import { UserSettingsDropdown } from 'components/Dropdown/UserSettingsDropdown';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { ProjectDispatch } from 'TodoApp';


interface NavbarAttrs {
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
}
export function Navbar ({ setShowSidebar, showSidebar }: NavbarAttrs) {

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
