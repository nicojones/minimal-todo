import { urls } from './urls';
import { text } from './text';

export const drawerConfig = {
  [urls.inboxUrl]: {
    url: urls.inboxUrl,
    text: text.drawer.inbox,
    icon: 'inbox',
    sort: 'timestamp,desc'
  },
  [urls.priorityUrl]: {
    url: urls.priorityUrl,
    text: text.drawer.priority,
    icon: 'flag',
    sort: 'priority,desc'
  }
};

export const drawerArray = Object.values(drawerConfig);
