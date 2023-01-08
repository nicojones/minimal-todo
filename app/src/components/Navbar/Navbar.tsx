import { ProjectContext } from "TodoApp";
import { UserSettingsDropdown } from "components/Dropdown/UserSettingsDropdown";
import { NavbarSearch } from "components/Navbar/NavbarSearch";
import { text, urls } from "config";
import { IProjectContext } from "interfaces";
import { Dispatch, SetStateAction, useContext } from "react";
import "./_navbar.scss";

interface NavbarAttrs {
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
}
export const Navbar = ({ setShowSidebar, showSidebar }: NavbarAttrs) => {
  const {changeToProject} = useContext<IProjectContext>(ProjectContext);

  return (
    <>
      <button className="todo-navbar__button btn">
        <i
          className="material-icons"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          menu
        </i>
      </button>
      <div className={"todo-navbar " + (showSidebar ? "open" : "closed")}>
        <nav className="navbar-hide">
          <div className="nav-wrapper">
            <button
              className="navbar-btn btn left"
              title={text.menu.menu}
              onClick={() => setShowSidebar(!showSidebar)}
              >
              <i className="material-icons">menu</i>
            </button>
            <button
              className="navbar-btn btn left"
              onClick={() => changeToProject({ secret: urls.inboxUrl })}
            >
              <i className="material-icons">home</i>
            </button>
            <NavbarSearch />
            <ul className="navbar-right">
              <li>
                <UserSettingsDropdown />
              </li>
            </ul>
            {/*<ul className="right hide-on-med-and-down">*/}
            {/*  <li><a href="sass.html">Sass</a></li>*/}
            {/*  <li><a href="badges.html">Components</a></li>*/}
            {/*  <li><a href="collapsible.html">Javascript</a></li>*/}
            {/*  <li><a href="mobile.html">Mobile</a></li>*/}
            {/*</ul>*/}
          </div>
        </nav>
      </div>
    </>
  );
};
