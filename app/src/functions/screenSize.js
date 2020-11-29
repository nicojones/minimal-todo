const smallWindow = 800; // smaller than this, and it's considered small.

window.isSmallScreen = false;

window.onresize = function () {
  window.isSmallScreen = (window.innerWidth < smallWindow);
  document.getElementById('root').className = (window.isSmallScreen ? 'mobile' : 'desktop');
}
window.onresize();

