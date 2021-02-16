export function screenSize () {

  const smallWindow = 800; // smaller than this, and it's considered small.

  (window as any).isSmallScreen = false;

  window.onresize = function () {
    (window as any).isSmallScreen = (window.innerWidth < smallWindow);
    (document.getElementById('root') as Element).className = ((window as any).isSmallScreen ? 'mobile' : 'desktop');
  };
  (window as any).onresize();

}
