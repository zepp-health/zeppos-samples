// helpers/required.js

// #region LOGGER
const LOG_LEVEL = 1; // set to 4 to see all the noise
const LOG_PREFIX = "T9KB > ";

export function debugLog(level, ...params) {
  if (level <= LOG_LEVEL) {
    const trunc_params = params.map((param) => {
      const MAX_ITEMS = 2;
      if (Array.isArray(param) && param.length > MAX_ITEMS) {
        return [...param.slice(0, MAX_ITEMS), ' ...more'];
      } else {
        return param;
      }
    });

    console.log(LOG_PREFIX, ...trunc_params);
  }
};
// #endregion


// device info cache (this is a slow call, 2-4ms)
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from '@zos/device';
export const DeviceInfo = getDeviceInfo();

// timing helper
export const timeIt = (label, func) => {
  if (LOG_LEVEL < 3) return func();
  const now = Date.now();
  const res = func();
  const end = Date.now();
  const dur = end - now;
  if (dur > 5) {
    debugLog(3, `${label}: ${dur}ms`);
  }
  return res;
};

// hide status bar on square watches
import { setStatusBarVisible } from '@zos/ui';

export function activateDefaults() {
  // hide the status bar
  if (DeviceInfo.screenShape === SCREEN_SHAPE_SQUARE) {
    setStatusBarVisible(false);
  }
}