import { urls } from './urls';
import { text } from './text';

export const constants = {
  defaultProjectColor: '#aaa',
  toast: {
    position: 'bottom-center',
    renderIcon: () => '',
    onClick: () => window.hideCogoToast()
  },
  maxDepth: 3,
  defaultSort: 'timestamp,desc',
  sort: [
    { icon: 'sort_by_alpha', name: text.sort.az, sort: '_name_lower,asc' },
    { icon: 'sort_by_alpha', name: text.sort.za, sort: '_name_lower,desc' },
    { icon: 'arrow_downward', name: text.sort.of, sort: 'timestamp,asc' },
    { icon: 'arrow_upward', name: text.sort.nf, sort: 'timestamp,desc' },
    { icon: 'flag', name: text.sort.pr, sort: 'priority,desc'}
  ],
  drawerSort: {
    [urls.inboxUrl]: 'timestamp,desc',
    [urls.priorityUrl]: 'priority,desc'
  }
};
