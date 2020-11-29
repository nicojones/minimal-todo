import React from 'react';
import UserSettingsDropdown from 'components/Dropdown/UserSettingsDropdown';
import './_navbar.scss';

function Navbar ({ setShowSidebar, showSidebar }) {

  return (
    <>
      <div className={ 'navbar-fixed todo-navbar ' + ( showSidebar ? 'open' : 'closed' ) }>
        <nav className="navbar-hide">
          <div className="nav-wrapper">
            <button className="btn-invisible sidenav-btn btn-subtle left" onClick={ () => setShowSidebar(!showSidebar) }>
              <i className="material-icons">menu</i>
            </button>
            {/*<button className="btn-invisible sidenav-btn btn-subtle left" onClick={ () => setShowSidebar(!showSidebar) }>*/}
            {/*  <i className="material-icons">inbox</i>*/}
            {/*</button>*/}
            {/*<form className="left" id="search-tasks">*/}
            {/*  <input type="text" className="input" placeholder={ text.task.search }/>*/}
            {/*</form>*/}
            <ul className="right">
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
    </>
  );
}

export default Navbar;
