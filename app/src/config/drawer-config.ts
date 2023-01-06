import { urls } from './urls';
import { text } from './text';
import { projectSort } from './constants';


export const drawerConfig = {
  [urls.inboxUrl]: {
    url: urls.inboxUrl,
    text: text.drawer.inbox,
    icon: 'inbox'
  },
  [urls.priorityUrl]: {
    url: urls.priorityUrl,
    text: text.drawer.priority,
    icon: 'flag'
  }
};

export const drawerArray = Object.values(drawerConfig);
