import { text } from './text';
import { urls } from './urls';


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
