import React, { useContext, useState } from 'react';
import { authService } from 'services/auth.service';
import { LoggedInUserContext } from 'App';
import { text } from 'config';
import { IUser } from '../../interfaces';


export function UserSettingsDropdown () {

  const [dropdownShown, setDropdownShown] = useState<boolean>(false);

  const user = useContext<IUser>(LoggedInUserContext);

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
              <button className="ib left left-align w-100" onClick={ authService.logout }>
                {/*<i className="material-icons subtle left">exit_to_app</i>*/}
                {/*<span className="left">{ text.Login.logout }</span>*/}
                { text.login.logout }
              </button>
            </li>
            <li className="">
              <small className="left subtle btn-p">{ text.loggedInAs(user.email) }</small>
            </li>
          </ul>
          <div className="backdrop" onClick={ () => setDropdownShown(false) }/>
        </>
      }
    </>
  );
}
