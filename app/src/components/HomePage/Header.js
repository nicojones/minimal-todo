import React, { useContext } from 'react';
import { LoggedInUserContext } from 'App';
import { text } from 'text';
import { urls } from 'urls';
import { Link } from 'react-router-dom';
import { authService } from 'services/authService';

function Header ({ loaded }) {
  const user = useContext(LoggedInUserContext);

  return (
    <>
      <nav>
        <div className="nav-wrapper container">
          <Link to={ urls.app } className="brand-logo">Todo List</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {
              user
                ? loaded && <>
                <li><Link to={ urls.app }>{ text.gotoApp }</Link></li>
                <li><a
                  href="#logout" onClick={ authService.logout }
                  className="btn-invisible"
                >{ text.login.logout }</a>
                </li>
              </>
                : loaded && <>
                <li><Link to={ urls.login }>{ text.login.login }</Link></li>
                <li><Link to={ urls.signup }>{ text.login.signup }</Link></li>
              </>
            }
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;
