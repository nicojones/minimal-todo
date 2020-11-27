export const urls = {
  home: '/',
  app: '/app',
  project: (id) => `${ urls.app }/${ id }`,
  login: '/login',
  signup: '/signup',

  inboxUrl: 'inbox',
}
