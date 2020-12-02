export const urls = {
  home: '/',
  app: '/app',
  project: (id) => `${ urls.app }/${ id }`,
  login: '/secure/login',
  signup: '/secure/signup',

  inboxUrl: 'inbox',
  priorityUrl: 'priority',
}
