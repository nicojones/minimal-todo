import React, {useContext, useState} from 'react';
import {AuthService} from 'services/auth.service';
import {LoggedInUserContext} from 'App';
import {text} from 'config';
import {ILoggedInUserContext, IUser, PDefault} from '../../interfaces';


export function UserSettingsDropdown () {

  const [dropdownShown, setDropdownShown] = useState<boolean>(false);

  const { user, setUser } = useContext<ILoggedInUserContext>(LoggedInUserContext);

  const logout = (e: PDefault) => {
    setUser(null);
    AuthService.logout();
  }

  return (
    <>
      <button className="btn navbar-btn" onClick={ () => setDropdownShown(true) }>
        <i className="material-icons">settings</i>
      </button>
      {
        dropdownShown &&
        <>
          <ul className="dropdown dd-left dd-big dd-high" onClick={ () => setDropdownShown(false) }>
            <li className="dropdown-item">
              <button className="ib left left-align w-100" onClick={ e => logout(e) }>
                {/*<i className="material-icons subtle left">exit_to_app</i>*/}
                {/*<span className="left">{ text.Login.logout }</span>*/}
                { text.login.logout }
              </button>
            </li>
            <li className="">
              <small className="left subtle btn-p">{ text.loggedInAs(user?.email as string) }</small>
            </li>
          </ul>
          <div className="backdrop" onClick={ () => setDropdownShown(false) }/>
        </>
      }
    </>
  );
}
