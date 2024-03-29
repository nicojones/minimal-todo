import { SpecialProjectUrl } from "interfaces";

export const urls = {
  home: '/',
  app: '/app',
  project: (id: string) => `${ urls.app }/${ id }`,
  login: '/secure/login',
  signup: '/secure/signup',

  settings: '/settings',

  inboxUrl: SpecialProjectUrl.INBOX,
  priorityUrl: SpecialProjectUrl.PRIORITY,
  deadlineUrl: SpecialProjectUrl.DEADLINE,
  todayUrl: SpecialProjectUrl.TODAY,
}
