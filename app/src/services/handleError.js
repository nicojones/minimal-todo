import { urls } from 'config/urls';
import cogoToast from 'cogo-toast';
import { constants } from 'config/constants';

export const handleError = (errorText, error) => {
  window.lastError = error;
  cogoToast.error(errorText, constants.toast);

  console.error(errorText, error);
  if (['401', '403'].indexOf(error.toString().split(' ').pop()) >= 0) {
    localStorage.removeItem('user');
    localStorage.removeItem('AuthToken');
    window.location.hash = urls.login;
  }
}
