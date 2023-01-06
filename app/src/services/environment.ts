export const environment = {
  production: true,
  url: 'http://localhost:8080'
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  environment.production = false;
}
