import cogoToast, { CToast } from 'cogo-toast';
import { constants } from 'config/constants';


export const showToast = (type: keyof CToast, message: string) => {
  const toast = cogoToast[type](message, constants.toast);
  (window as any).hideCogoToast = toast.hide;
};
