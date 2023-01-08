import { SpecialProjectUrl } from "interfaces";

export const urls = {
  home: '/',
  app: '/app',
  project: (id: string) => `${ urls.app }/${ id }`,
  login: '/secure/login',
  signup: '/secure/signup',

  inboxUrl: SpecialProjectUrl.INBOX,
  priorityUrl: SpecialProjectUrl.PRIORITY,
}
