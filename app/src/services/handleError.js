export const handleError = (errorText, error) => {
  console.error(errorText, error);
  if (['401', '403'].indexOf(error.toString().split(' ').pop()) >= 0) {
    localStorage.removeItem('user');
    localStorage.removeItem('AuthToken');
    window.location.replace('/login');
  }
}
