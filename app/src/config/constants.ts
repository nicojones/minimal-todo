import { urls } from './urls';
import { text } from './text';
// import {CTOptions} from 'cogo-toast';


export const projectSort: Record<string, string> = {
  OLDEST_FIRST: "OLDEST_FIRST",
  Z_TO_A: "Z_TO_A",
  A_TO_Z: "A_TO_Z",
  NEWEST_FIRST: "NEWEST_FIRST",
  PRIORITY: "PRIORITY"
};

export const constants = {
  defaultProjectColor: '#aaa',
  toast: {
    position: 'bottom-center',
    renderIcon: () => '',
    onClick: () => (window as any).hideCogoToast()
  } as any,
  maxDepth: 10,
  defaultSort: projectSort.OLDEST_FIRST,
  sortOptions: [
    { icon: 'sort_by_alpha', name: text.sort.az, sort: projectSort.A_TO_Z },
    { icon: 'sort_by_alpha', name: text.sort.za, sort: projectSort.Z_TO_A },
    { icon: 'arrow_downward', name: text.sort.of, sort: projectSort.OLDEST_FIRST },
    { icon: 'arrow_upward', name: text.sort.nf, sort: projectSort.NEWEST_FIRST },
    { icon: 'flag', name: text.sort.pr, sort: projectSort.PRIORITY }
  ],
  drawerSort: {
    [urls.inboxUrl]: projectSort.OLDEST_FIRST,
    [urls.priorityUrl]: projectSort.PRIORITY
  },
  storageKey: {
    PB_USER: "PB_USER",
    AUTH_TOKEN: "AUTH_TOKEN"
  },
};
