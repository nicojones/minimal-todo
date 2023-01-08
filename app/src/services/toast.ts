// import cogoToast, { CToast } from 'cogo-toast';

import { toast } from "react-hot-toast";


export const showToast = (type: "error" | "success", message: string) => {
  toast[type](message);
};
