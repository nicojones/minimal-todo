import { urls } from 'config/urls';
import cogoToast from 'cogo-toast';
import { defaultToast } from '../config/defaultToast';

export const handleError = (errorText, error) => {
  cogoToast.error(errorText, defaultToast);

  console.error(errorText, error);
  if (['401', '403'].indexOf(error.toString().split(' ').pop()) >= 0) {
    localStorage.removeItem('user');
    localStorage.removeItem('AuthToken');
    window.location.hash = urls.login;
  }
}
