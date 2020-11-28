import { urls } from './urls';

export const constants = {
  defaultProjectColor: '#aaa',
  toast: { position: 'bottom-center' },
  maxDepth: 3,
  defaultSort: 'timestamp,desc',
  sort: [
    { icon: 'sort_by_alpha', name: 'A -> Z', sort: '_name_lower,asc' },
    { icon: 'sort_by_alpha', name: 'Z -> A', sort: '_name_lower,desc' },
    { icon: 'arrow_downward', name: 'Oldest First', sort: 'timestamp,asc' },
    { icon: 'arrow_upward', name: 'Newest First', sort: 'timestamp,desc' },
    { icon: 'flag', name: 'Priority', sort: 'priority,desc'}
  ],
  drawerSort: {
    [urls.inboxUrl]: 'timestamp,desc',
    [urls.priorityUrl]: 'priority,desc'
  }
};
