import { urls } from 'config/urls';
import { showToast } from './toast';

export const handleError = (errorText, error) => {
  window.lastError = error;
  showToast('error', errorText);

  console.error(errorText, error);
  if (['401', '403'].indexOf(error.toString().split(' ').pop()) >= 0) {
    localStorage.removeItem('user');
    localStorage.removeItem('AuthToken');
    window.location.hash = urls.login;
  }
}
