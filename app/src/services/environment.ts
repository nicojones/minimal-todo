export const environment = {
  production: true,
  url: 'http://192.168.0.2:8080'
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  environment.production = false;
}
