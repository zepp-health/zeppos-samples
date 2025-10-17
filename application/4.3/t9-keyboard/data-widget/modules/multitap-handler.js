// modules/multitap-handler.js
import { keyboard } from './safe-keyboard';
import { T9_LETTER_MAP, SYMBOL_MAP, CAPS_MODES, MULTITAP_TIMEOUT } from './keyboard-config';
import { debugLog, timeIt } from '../../helpers/required';

export class MultitapHandler {
  constructor(keyboard) {
    this.keyboard = keyboard;
  }

  handleT9KeyPress(digit) {
    timeIt('multitap-handleT9KeyPress', () => {
      const now = Date.now();
      const letters = T9_LETTER_MAP[digit];
      if (!letters) return;

      if (this.keyboard.state.cur_multitap_key !== digit || !this.keyboard.state.is_in_multitap_mode) {
        this.keyboard.state.cur_sequence += digit;
        keyboard.inputBuffer(this.keyboard.state.cur_sequence, 0xFFFFFF, 0x00FF00);
        debugLog(3, `added digit ${digit} to t9 sequence: "${this.keyboard.state.cur_sequence}"`);
      }

      if (this.keyboard.state.cur_multitap_key === digit &&
        (now - this.keyboard.state.lastkey_time) < MULTITAP_TIMEOUT &&
        this.keyboard.state.is_in_multitap_mode) {
        this.keyboard.state.multitap_idx = (this.keyboard.state.multitap_idx + 1) % letters.length;
        this.keyboard.state.pending_char = letters[this.keyboard.state.multitap_idx];
        debugLog(3, `multitap ${digit}: idx ${this.keyboard.state.multitap_idx}, char '${this.keyboard.state.pending_char}'`);
      } else {
        if (this.keyboard.state.has_pending_char) {
          this.commitPendingChar();
        }

        this.keyboard.state.cur_multitap_key = digit;
        this.keyboard.state.multitap_idx = 0;
        this.keyboard.state.is_in_multitap_mode = true;
        this.keyboard.state.pending_char = letters[0];
        this.keyboard.state.has_pending_char = true;
        debugLog(3, `new multitap ${digit}: char '${this.keyboard.state.pending_char}'`);
      }

      this.keyboard.inputFieldManager.resetCursorActivity();

      if (this.keyboard.state.multitap_timer) {
        clearTimeout(this.keyboard.state.multitap_timer);
      }

      this.keyboard.state.multitap_timer = setTimeout(() => {
        debugLog(3, `multitap timeout - committing '${this.keyboard.state.pending_char}'`);
        this.commitPendingChar();
        this.keyboard.state.cur_multitap_key = null;
      }, MULTITAP_TIMEOUT);

      this.keyboard.inputFieldManager.updateSingleLineDisplay(true);
    });
  }

  handleSymbolPress() {
    const now = Date.now();
    const symbols = SYMBOL_MAP['1'];

    if (this.keyboard.state.cur_multitap_key === '1' &&
      (now - this.keyboard.state.lastkey_time) < MULTITAP_TIMEOUT &&
      this.keyboard.state.is_in_multitap_mode) {

      this.keyboard.state.multitap_idx = (this.keyboard.state.multitap_idx + 1) % symbols.length;
      this.keyboard.state.pending_char = symbols[this.keyboard.state.multitap_idx];

      debugLog(3, `symbol multitap: idx ${this.keyboard.state.multitap_idx}, char '${this.keyboard.state.pending_char}'`);

    } else {
      if (this.keyboard.state.has_pending_char) {
        this.commitPendingChar();
      }

      this.keyboard.state.cur_multitap_key = '1';
      this.keyboard.state.multitap_idx = 0;
      this.keyboard.state.is_in_multitap_mode = true;
      this.keyboard.state.pending_char = symbols[0];
      this.keyboard.state.has_pending_char = true;

      debugLog(3, `new symbol multitap: char '${this.keyboard.state.pending_char}'`);
    }

    this.keyboard.inputFieldManager.resetCursorActivity();

    if (this.keyboard.state.multitap_timer) {
      clearTimeout(this.keyboard.state.multitap_timer);
    }

    this.keyboard.state.multitap_timer = setTimeout(() => {
      debugLog(3, `symbol multitap timeout - committing '${this.keyboard.state.pending_char}'`);
      this.commitPendingChar();
      if (['.', '!', '?'].includes(this.keyboard.state.pending_char)) {
        this.keyboard.state.cur_sequence = '';
        debugLog(3, `cleared t9 sequence after punctuation`);
      }
      this.keyboard.state.cur_multitap_key = null;
    }, MULTITAP_TIMEOUT);

    this.keyboard.inputFieldManager.updateSingleLineDisplay();
  }

  commitPendingChar() {
    timeIt('commitPendingChar', () => {
      if (this.keyboard.state.pending_char && this.keyboard.state.has_pending_char) {
        let char_to_insert = this.keyboard.state.pending_char;

        if (this.keyboard.state.caps_mode === CAPS_MODES.ALL_CAPS || this.keyboard.state.caps_mode === CAPS_MODES.LOCK) {
          char_to_insert = char_to_insert.toUpperCase();
        } else if (this.keyboard.state.caps_mode === CAPS_MODES.ON) {
          char_to_insert = char_to_insert.toUpperCase();
        } else if (this.keyboard.state.caps_mode === CAPS_MODES.FIRST) {
          const cursor_pos = this.keyboard.state.cursor_pos;
          const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);

          if (before_cursor.length === 0) {
            char_to_insert = char_to_insert.toUpperCase();
          } else {
            const last_char = before_cursor[before_cursor.length - 1];
            if (last_char === ' ' || last_char === '.' || last_char === '!' || last_char === '?') {
              char_to_insert = char_to_insert.toUpperCase();
            }
          }
        }

        const cursor_pos = this.keyboard.state.cursor_pos;
        const before = this.keyboard.state.full_text.substring(0, cursor_pos);
        const after = this.keyboard.state.full_text.substring(cursor_pos);
        this.keyboard.state.full_text = before + char_to_insert + after;
        this.keyboard.state.cursor_pos = cursor_pos + 1;

        debugLog(3, `committed char '${char_to_insert}', text: "${this.keyboard.state.full_text}"`);

        this.keyboard.state.pending_char = '';
        this.keyboard.state.has_pending_char = false;
        this.keyboard.state.is_in_multitap_mode = false;
        this.keyboard.state.multitap_idx = 0;

        if (this.keyboard.state.multitap_timer) {
          clearTimeout(this.keyboard.state.multitap_timer);
          this.keyboard.state.multitap_timer = null;
        }

        this.updateCapsAfterChar();
        this.keyboard.updateKeyboardState();
      }
    });
  }

  applyCapitalization(char) {
    const code = char.charCodeAt(0);
    // A-Z, a-z
    const is_alpha = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    if (!is_alpha) return char;

    const caps = this.keyboard.state.caps_mode;
    if (caps === CAPS_MODES.ON || caps === CAPS_MODES.LOCK || caps === CAPS_MODES.FIRST) {
      return char.toUpperCase();
    }
    return char.toLowerCase();
  }

  updateCapsAfterChar() {
    if (this.keyboard.state.caps_mode === CAPS_MODES.FIRST) {
      this.keyboard.state.caps_mode = CAPS_MODES.OFF;
      this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    } else if (this.keyboard.state.caps_mode === CAPS_MODES.ON) {
      this.keyboard.state.caps_mode = CAPS_MODES.OFF;
      this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    }
  }
}