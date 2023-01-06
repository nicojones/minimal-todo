// import cogoToast, { CToast } from 'cogo-toast';

import { toast } from "react-hot-toast";


export const showToast = (type: "error" | "success", message: string) => {
  console.log("showing toast", message);
  toast[type](message);
};
