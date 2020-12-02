import React, { useState } from 'react';
import { text } from 'config/text';
import { useHistory } from 'react-router-dom';
import { LoggedInUserContext } from 'App';
import { authService } from 'services/authService';

function UserSettingsDropdown () {

  const [dropdownShown, setDropdownShown] = useState(false);

  const history = useHistory();
  const user = React.useContext(LoggedInUserContext);

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

export default UserSettingsDropdown;
