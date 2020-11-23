const smallWindow = 800; // smaller than this, and it's considered small.

window.isSmallScreen = false;

window.onresize = function () {
  window.isSmallScreen = (window.innerWidth < smallWindow);
}
window.onresize();

