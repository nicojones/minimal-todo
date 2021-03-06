import React, { useState } from 'react';
import { authService } from 'services/auth.service';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { showToast } from 'services/toast';
import { LoggedInUserContext } from 'App';
import { text, urls } from 'config';
import { LoginBox } from 'components/Login/LoginBox';
import { ISignupForm, ISignupFormError, PDefault } from 'interfaces';


export function Signup () {

  const history = useHistory();

  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [signup, setSignup] = useState<ISignupForm>({} as ISignupForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<ISignupFormError>({});

  // If the user is logged in already, redirect to the app!
  if (React.useContext(LoggedInUserContext)) {
    history.push(urls.app);
    return null;
  }

  async function onSubmit (e: PDefault) {
    e.preventDefault();

    const _signupError = authService.validateSignup(signup);
    const errors = Object.values(_signupError);
    if (!errors.length) {
      setLoading(true);
      authService
        .signup(signup)
        .then((responseData) => {
          setLoading(false);
          if (responseData.user) {
            showToast('success', text.login.signupSuccess);
            setSignup({} as ISignupForm);
            setLoggingIn(true);
          }
        })
        .catch(({ response }) => {
          if (response.data && response.data.code) {
            authService.loginCatch(response.data);
          } else {
            setSignupError(response.data);
            const errors = Object.values(response.data);
            errors.length && showToast('error', errors[0] as string);
          }
          setLoading(false);
        });
    } else {
      setSignupError(_signupError);
      errors.length && showToast('error', errors[0] as string);
    }
  }

  function updateSignup (partial: Partial<ISignupForm>) {
    setSignup({ ...signup, ...partial });
  }

  return (
    <>
      {
        loggingIn
          ? <Redirect to="/app"/>
          :
          <>
            <LoginBox data-tip={ text.login.signup } loading={ loading }>
              <form onSubmit={ onSubmit } className="flex-center-self">

                <div className="form-group">
                  <label>{ text.login.f.name._ }</label>
                  <input
                    value={ signup.name || '' }
                    onChange={ (e) => updateSignup({ name: e.target.value }) }
                    placeholder={ text.login.f.name.ph } required autoComplete="off"
                  />
                  { signupError.name && <small>{ signupError.name }</small> }
                </div>

                <div className="form-group">
                  <label>{ text.login.f.email._ }</label>
                  <input
                    value={ signup.email || '' }
                    onChange={ (e) => updateSignup({ email: e.target.value }) }
                    placeholder={ text.login.f.email.ph } type="email" required autoFocus autoComplete="off"
                  />
                  { signupError.email && <small>{ signupError.email }</small> }
                </div>

                {/*<div className="form-group">*/}
                {/*  <label>{ text.login.f.username._ }</label>*/}
                {/*  <input*/}
                {/*    value={ signup.username || '' }*/}
                {/*    onChange={ (e) => updateSignup({ username: e.target.value }) }*/}
                {/*    placeholder={ text.login.f.username.ph } required autoComplete="off"*/}
                {/*  />*/}
                {/*  { signupError.username && <small>{ signupError.username }</small> }*/}
                {/*</div>*/}

                <div className="form-group">
                  <label>{ text.login.f.password.new }</label>
                  <input
                    value={ signup.password || '' }
                    onChange={ (e) => updateSignup({ password: e.target.value }) }
                    placeholder={ text.login.f.password.ph } type="password" required autoComplete="off"
                  />
                  { signupError.password && <small>{ signupError.password }</small> }
                </div>

                <br/>
                <div className="flex-column">
                  <button type="submit" className="btn btn-block main-btn">{ text.login.signup }</button>
                  <hr/>
                  <Link className="no-color u" to={ urls.login }>{ text.login.yesAccount } { text.login.login }</Link>
                </div>

              </form>
            </LoginBox>
          </>
      }
    </>
  );
}
