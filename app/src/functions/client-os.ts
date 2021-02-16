export const osName = {
  Unknown: 'u',
  Android: 'android',
  iOS: 'ios',
  Windows: 'win',
  MacOS: 'mac',
  Linux: 'linux',
  storage: 'cs' // the name of the localstorage key.
}


/**
 * Function from StackOverflow to detect OS. Maybe not needed, but it's just to be fancy
 * {@url https://stackoverflow.com/a/38241481/2016686}
 */
export function guessClientOS () {
  /**
   * As detected by the browser.
   */
  const platform = window.navigator.platform;

  /**
   * These are the possible values
   */
  const macOsPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  /**
   * This is what we need to guess.
   */
  let os = osName.Unknown;
  let isMobile = false;

  if (macOsPlatforms.indexOf(platform) !== -1) {
    os = osName.MacOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = osName.Windows;
  } else if (/Linux/.test(platform)) {
    os = osName.Linux;
  } else {
    // Otherwise, we try with phones...
    const userAgent = window.navigator.userAgent;
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    if (/Android/.test(userAgent)) {
      os = osName.Android;
      isMobile = true;
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = osName.iOS;
      isMobile = true;
    }
  }

  return { isMobile, os };
}
