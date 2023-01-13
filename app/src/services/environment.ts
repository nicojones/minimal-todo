export const environment = {
  production: true,
  // url: 'http://localhost'
  url: 'https://minimaltodo.com'
};

if (process.env.NODE_ENV !== 'production') {
  environment.url = 'http://localhost'
}