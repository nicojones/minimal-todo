import cogoToast from 'cogo-toast';
import { constants } from 'config/constants';

export const showToast = (type, message) => {
  const toast = cogoToast[type](message, constants.toast);
  window.hideCogoToast = toast.hide;
};
