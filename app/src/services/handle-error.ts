import { urls } from 'config/urls';
import { showToast } from './toast';


export const handleError = (errorText: string, error: Error) => {
  (window as any).lastError = error;
  showToast('error', errorText);

  console.error(errorText, error);
  if (['401', '403'].indexOf((error as any).toString().split(' ').pop()) >= 0) {
    localStorage.removeItem('user');
    localStorage.removeItem('AuthToken');
    window.location.hash = urls.login;
  }
}
