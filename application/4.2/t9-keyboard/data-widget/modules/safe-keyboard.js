// modules/safe-keyboard.js
import { debugLog } from '../../helpers/required';

let keyboard_api = null;
let keyboard_supported = false;
let warn_logged = false;

try {
  const zos_ui = __$$R$$__('@zos/ui');
  if (zos_ui && zos_ui.keyboard) {
    keyboard_api = zos_ui.keyboard;
    keyboard_supported = true;
    debugLog(2, 'keyboard api supported');
  }
} catch (e) {
  keyboard_supported = false;
  debugLog(1, `keyboard api load failed: ${e}`);
}

function warnUnsup(method_name) {
  if (!warn_logged) {
    debugLog(1, 'keyboard api not fully supported - using fallback mode');
    warn_logged = true;
  }
  debugLog(4, `keyboard.${method_name}() not available or not a function`);
}

function hasMethod(method_name) {
  return keyboard_supported &&
    keyboard_api &&
    typeof keyboard_api[method_name] === 'function';
}

const fallback_state = {
  content_rect: { x: 0, y: 0, w: 0, h: 0 },
  text_context: '',
  buffer: ''
};

export const keyboard = {
  setContentRect(rect) {
    if (hasMethod('setContentRect')) {
      try {
        return keyboard_api.setContentRect(rect);
      } catch (e) {
        debugLog(1, `setContentRect error: ${e}`);
      }
    }
    warnUnsup('setContentRect');
    fallback_state.content_rect = { ...rect };
  },

  getContentRect() {
    if (hasMethod('getContentRect')) {
      try {
        return keyboard_api.getContentRect();
      } catch (e) {
        debugLog(1, `getContentRect error: ${e}`);
      }
    }
    warnUnsup('getContentRect');
    return { ...fallback_state.content_rect };
  },

  getTextContext() {
    if (hasMethod('getTextContext')) {
      try {
        return keyboard_api.getTextContext();
      } catch (e) {
        debugLog(1, `getTextContext error: ${e}`);
      }
    }
    warnUnsup('getTextContext');
    return fallback_state.text_context;
  },

  inputText(text) {
    if (hasMethod('inputText')) {
      try {
        return keyboard_api.inputText(text);
      } catch (e) {
        debugLog(1, `inputText error: ${e}`);
      }
    }
    warnUnsup('inputText');
    fallback_state.text_context += text;
  },

  backspace(count = 1) {
    if (hasMethod('backspace')) {
      try {
        return keyboard_api.backspace(count);
      } catch (e) {
        debugLog(1, `backspace error: ${e}`);
      }
    }
    warnUnsup('backspace');
    const len = fallback_state.text_context.length;
    fallback_state.text_context = fallback_state.text_context.substring(0, Math.max(0, len - count));
  },

  clearInput() {
    if (hasMethod('clearInput')) {
      try {
        return keyboard_api.clearInput();
      } catch (e) {
        debugLog(1, `clearInput error: ${e}`);
      }
    }
    warnUnsup('clearInput');
    fallback_state.text_context = '';
  },

  sendFnKey(key_type) {
    if (hasMethod('sendFnKey')) {
      try {
        return keyboard_api.sendFnKey(key_type);
      } catch (e) {
        debugLog(1, `sendFnKey error: ${e}`);
      }
    }
    warnUnsup('sendFnKey');
    switch (key_type) {
      case keyboard.BACKSPACE:
        keyboard.backspace();
        break;
      case keyboard.ENTER:
        debugLog(3, 'simulated enter key');
        break;
      case keyboard.SWITCH:
        debugLog(3, 'simulated keyboard switch');
        break;
      case keyboard.SELECT:
        debugLog(3, 'simulated keyboard select');
        break;
    }
  },

  inputBuffer(text, text_color = 0xFFFFFF, underline_color = 0xFFFFFF) {
    if (hasMethod('inputBuffer')) {
      try {
        return keyboard_api.inputBuffer(text, text_color, underline_color);
      } catch (e) {
        debugLog(1, `inputBuffer error: ${e}`);
      }
    }
    warnUnsup('inputBuffer');
    fallback_state.buffer = text;
  },

  getBuffer() {
    if (hasMethod('getBuffer')) {
      try {
        return keyboard_api.getBuffer();
      } catch (e) {
        debugLog(1, `getBuffer error: ${e}`);
      }
    }
    warnUnsup('getBuffer');
    return fallback_state.buffer;
  },

  clearBuffer() {
    if (hasMethod('clearBuffer')) {
      try {
        return keyboard_api.clearBuffer();
      } catch (e) {
        debugLog(1, `clearBuffer error: ${e}`);
      }
    }
    warnUnsup('clearBuffer');
    fallback_state.buffer = '';
  },

  switchInputType(input_type) {
    if (hasMethod('switchInputType')) {
      try {
        return keyboard_api.switchInputType(input_type);
      } catch (e) {
        debugLog(1, `switchInputType error: ${e}`);
      }
    }
    warnUnsup('switchInputType');
  },

  gotoSettings() {
    if (hasMethod('gotoSettings')) {
      try {
        return keyboard_api.gotoSettings();
      } catch (e) {
        debugLog(1, `gotoSettings error: ${e}`);
      }
    }
    warnUnsup('gotoSettings');
    try {
      const r = __$$R$$__('@zos/router');
      if (r && r.launchApp) {
        r.launchApp({ url: 'Settings_keyboardScreen', params: { native: true } });
      }
    } catch (e) {
      debugLog(1, `gotoSettings fallback failed: ${e}`);
    }
  },

  checkVoiceInputAvailable() {
    if (hasMethod('checkVoiceInputAvailable')) {
      try {
        return keyboard_api.checkVoiceInputAvailable();
      } catch (e) {
        debugLog(1, `checkVoiceInputAvailable error: ${e}`);
      }
    }
    warnUnsup('checkVoiceInputAvailable');
    return false;
  },

  isEnabled() {
    if (hasMethod('isEnabled')) {
      try {
        return keyboard_api.isEnabled();
      } catch (e) {
        debugLog(1, `isEnabled error: ${e}`);
      }
    }
    warnUnsup('isEnabled');
    return true;
  },

  isSelected() {
    if (hasMethod('isSelected')) {
      try {
        return keyboard_api.isSelected();
      } catch (e) {
        debugLog(1, `isSelected error: ${e}`);
      }
    }
    warnUnsup('isSelected');
    return true;
  },

  isSupported() {
    return keyboard_supported;
  },

  BACKSPACE: keyboard_supported && keyboard_api && keyboard_api.BACKSPACE !== undefined
    ? keyboard_api.BACKSPACE : 1,
  ENTER: keyboard_supported && keyboard_api && keyboard_api.ENTER !== undefined
    ? keyboard_api.ENTER : 2,
  SWITCH: keyboard_supported && keyboard_api && keyboard_api.SWITCH !== undefined
    ? keyboard_api.SWITCH : 3,
  SELECT: keyboard_supported && keyboard_api && keyboard_api.SELECT !== undefined
    ? keyboard_api.SELECT : 4,

  hasMethod(method_name) {
    return hasMethod(method_name);
  }
};