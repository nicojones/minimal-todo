import { MinimalProject, SpecialProjectUrl } from 'interfaces';
import { text } from './text';
import { urls } from './urls';


export const drawerConfig: Record<SpecialProjectUrl, MinimalProject> = {
  [SpecialProjectUrl.INBOX]: {
    id: urls.inboxUrl,
    name: text.drawer.inbox._,
    icon: 'inbox',
    created: 0,
    updated: 0,
    color: "#000000",
  },
  [SpecialProjectUrl.PRIORITY]: {
    id: urls.priorityUrl,
    name: text.drawer.priority._,
    icon: 'flag',
    color: "#000000",
    created: 0,
    updated: 0,
  }
};

export const drawerArray = Object.values(drawerConfig);
