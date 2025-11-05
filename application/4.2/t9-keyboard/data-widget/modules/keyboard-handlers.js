// modules/keyboard-handlers.js
import { keyboard } from './safe-keyboard';
import { inputType } from '@zos/ui';
import { KEYBOARD_MODES, CAPS_MODES, NUMBER_SYMBOL_MAP, MULTITAP_TIMEOUT } from './keyboard-config';
import { debugLog, timeIt } from '../../helpers/required';
import { t9_engine } from '../engine/t9-engine';
import { Vibrator } from '@zos/sensor';

const vibro = new Vibrator();

export class KeyboardHandlers {
  constructor(keyboard) {
    this.keyboard = keyboard;
  }

  handleNumberPress(digit) {
    const now = Date.now();
    const time_since_last_key = now - this.keyboard.state.lastkey_time;

    if (digit === '0' || digit === '*') {
      this.keyboard.state.is_in_multitap_mode = false;
      this.keyboard.state.cur_multitap_key = null;
      this.keyboard.state.multitap_idx = 0;

      if (this.keyboard.state.multitap_timer) {
        clearTimeout(this.keyboard.state.multitap_timer);
        this.keyboard.state.multitap_timer = null;
      }

      const cursor_pos = this.keyboard.state.cursor_pos;
      const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);
      const after_cursor = this.keyboard.state.full_text.substring(cursor_pos);

      this.keyboard.state.full_text = before_cursor + digit + after_cursor;
      this.keyboard.state.cursor_pos = cursor_pos + 1;

      keyboard.inputText(digit);

      debugLog(3, `inserted "${digit}" at pos ${cursor_pos}, new cursor pos: ${this.keyboard.state.cursor_pos}`);
      this.keyboard.updateKeyboardState();
      this.keyboard.updateInputEmptyState();
      return;
    }

    const is_multitap = (
      this.keyboard.state.keyboard_mode === KEYBOARD_MODES.NUMBERS &&
      this.keyboard.state.cur_multitap_key === digit &&
      this.keyboard.state.is_in_multitap_mode &&
      time_since_last_key > 0 &&
      time_since_last_key < MULTITAP_TIMEOUT
    );

    if (is_multitap) {
      debugLog(3, `multitap detected on ${digit}`);
      this.handleNumberSymbolMultitap(digit);
      this.keyboard.state.lastkey_time = now;
      return;
    }

    debugLog(3, `new digit ${digit} - inserting`);

    const cursor_pos = this.keyboard.state.cursor_pos;
    const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);
    const after_cursor = this.keyboard.state.full_text.substring(cursor_pos);

    this.keyboard.state.full_text = before_cursor + digit + after_cursor;
    this.keyboard.state.cursor_pos = cursor_pos + 1;

    keyboard.inputText(digit);

    if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.NUMBERS) {
      this.keyboard.state.is_in_multitap_mode = true;
      this.keyboard.state.cur_multitap_key = digit;
      this.keyboard.state.multitap_idx = 0;
      this.keyboard.state.lastkey_time = now;

      if (this.keyboard.state.multitap_timer) {
        clearTimeout(this.keyboard.state.multitap_timer);
      }

      this.keyboard.state.multitap_timer = setTimeout(() => {
        debugLog(3, `multitap timeout for ${digit}`);
        this.keyboard.state.is_in_multitap_mode = false;
        this.keyboard.state.cur_multitap_key = null;
        this.keyboard.state.multitap_idx = 0;
      }, MULTITAP_TIMEOUT);
    }

    debugLog(3, `inserted number "${digit}" at pos ${cursor_pos}, new cursor pos: ${this.keyboard.state.cursor_pos}`);
    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();
  }

  handleNumberSymbolMultitap(digit) {
    const symbols = NUMBER_SYMBOL_MAP[digit];
    const symbols_len = symbols ? symbols.length : 0;
    if (!symbols || symbols_len === 0) {
      debugLog(3, `no symbols for digit ${digit}`);
      return;
    }

    this.keyboard.state.multitap_idx = (this.keyboard.state.multitap_idx + 1) % symbols_len;
    const char = symbols[this.keyboard.state.multitap_idx];
    debugLog(3, `multitap ${digit}: idx=${this.keyboard.state.multitap_idx}/${symbols_len}, char='${char}'`);

    const cursor_pos = this.keyboard.state.cursor_pos;
    if (cursor_pos > 0) {
      const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos - 1);
      const after_cursor = this.keyboard.state.full_text.substring(cursor_pos);
      this.keyboard.state.full_text = before_cursor + char + after_cursor;
      keyboard.backspace(1);
      keyboard.inputText(char);
    }

    if (this.keyboard.state.multitap_timer) {
      clearTimeout(this.keyboard.state.multitap_timer);
    }

    this.keyboard.state.multitap_timer = setTimeout(() => {
      debugLog(3, `multitap timeout - resetting for ${digit}`);
      this.keyboard.state.is_in_multitap_mode = false;
      this.keyboard.state.cur_multitap_key = null;
      this.keyboard.state.multitap_idx = 0;
    }, MULTITAP_TIMEOUT);

    this.keyboard.updateKeyboardState();
  }

  handleModeSwitch() {
    timeIt('handleModeSwitch', () => {
      debugLog(3, 'mode switch pressed');
      this.keyboard.multitapHandler.commitPendingChar();

      t9_engine.cancel();

      if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.T9) {
        this.keyboard.state.keyboard_mode = KEYBOARD_MODES.NUMBERS;
        debugLog(3, 'switched to numbers mode');
      } else if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.NUMBERS) {
        this.keyboard.state.keyboard_mode = KEYBOARD_MODES.T9;
        debugLog(3, 'switched to t9 mode');
      } else if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.EMOJI) {
        this.keyboard.state.keyboard_mode = KEYBOARD_MODES.NUMBERS;
        debugLog(3, 'switched from emoji to numbers mode');
      }

      this.keyboard.keyboardRenderer.updateKeyboardVisuals();
      this.keyboard.updateKeyboardState();

      this.vibrate();
    });
  }

  handleEmojiMode() {
    debugLog(3, 'emoji button pressed');
    this.keyboard.multitapHandler.commitPendingChar();

    if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.EMOJI) {
      this.keyboard.state.keyboard_mode = KEYBOARD_MODES.T9;
      debugLog(3, 'exited emoji mode');
    } else {
      this.keyboard.state.keyboard_mode = KEYBOARD_MODES.EMOJI;
      debugLog(3, 'entered emoji mode');
    }

    this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    this.keyboard.updateKeyboardState();

    this.vibrate();
  }

  handleEmojiPress(emoji) {
    debugLog(3, `emoji pressed: ${emoji}`);

    const cursor_pos = this.keyboard.state.cursor_pos;
    const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);
    const after_cursor = this.keyboard.state.full_text.substring(cursor_pos);

    this.keyboard.state.full_text = before_cursor + emoji + after_cursor;
    this.keyboard.state.cursor_pos = cursor_pos + emoji.length;

    keyboard.inputText(emoji);

    debugLog(3, `inserted emoji "${emoji}" at pos ${cursor_pos}`);
    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();
  }

  handleShift() {
    debugLog(3, 'shift pressed');

    switch (this.keyboard.state.caps_mode) {
      case CAPS_MODES.OFF:
        this.keyboard.state.caps_mode = CAPS_MODES.ON;
        break;
      case CAPS_MODES.FIRST:
        this.keyboard.state.caps_mode = CAPS_MODES.OFF;
        break;
      case CAPS_MODES.ON:
        this.keyboard.state.caps_mode = CAPS_MODES.OFF;
        break;
      case CAPS_MODES.LOCK:
        this.keyboard.state.caps_mode = CAPS_MODES.OFF;
        break;
    }

    debugLog(3, `caps mode: ${this.keyboard.state.caps_mode}`);
    this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    this.keyboard.updateKeyboardState();

    this.vibrate();
  }

  handleCapsLock() {
    debugLog(3, 'caps lock (long press shift)');
    this.keyboard.state.caps_mode = CAPS_MODES.LOCK;
    debugLog(3, `caps mode: ${this.keyboard.state.caps_mode}`);
    this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    this.keyboard.updateKeyboardState();

    this.vibrate();
  }

  handleBackspace() {
    debugLog(3, 'backspace pressed');
    this.keyboard.multitapHandler.commitPendingChar();

    if (this.keyboard.state.multitap_timer) {
      clearTimeout(this.keyboard.state.multitap_timer);
      this.keyboard.state.multitap_timer = null;
    }
    this.keyboard.state.is_in_multitap_mode = false;
    this.keyboard.state.cur_multitap_key = null;
    this.keyboard.state.multitap_idx = 0;

    const cur_pos = this.keyboard.state.cursor_pos;
    if (cur_pos === 0) return;

    const full_text = this.keyboard.state.full_text;
    const before = full_text.substring(0, cur_pos);
    const after = full_text.substring(cur_pos);

    let chars_to_delete = 1;
    if (cur_pos >= 2) {
      const char_before = full_text.charCodeAt(cur_pos - 1);
      if (char_before >= 0xDC00 && char_before <= 0xDFFF) {
        const char_before_that = full_text.charCodeAt(cur_pos - 2);
        if (char_before_that >= 0xD800 && char_before_that <= 0xDBFF) {
          chars_to_delete = 2;
          debugLog(3, `detected surrogate pair at pos ${cur_pos - 2}, deleting 2 chars`);
        }
      }
    }

    const new_before = before.substring(0, before.length - chars_to_delete);
    this.keyboard.state.full_text = new_before + after;
    this.keyboard.state.cursor_pos = cur_pos - chars_to_delete;

    // rebuild T9 seq from cur word
    if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.T9) {
      this.rebuildT9Sequence();
    } else {
      this.keyboard.state.cur_sequence = '';
      keyboard.clearBuffer();
    }

    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();

    this.vibrate();
  }

  rebuildT9Sequence() {
    const full_text = this.keyboard.state.full_text;
    const cur_pos = this.keyboard.state.cursor_pos;

    let word_start = cur_pos;
    for (let i = cur_pos - 1; i >= 0; i--) {
      const char = full_text[i];
      if (char === ' ' || char === '.' || char === '!' || char === '?' ||
        char === ',' || char === ':' || char === ';') {
        word_start = i + 1;
        break;
      }
      if (i === 0) {
        word_start = 0;
      }
    }

    const cur_word = full_text.substring(word_start, cur_pos);
    const new_sequence = t9_engine.wordToSeq(cur_word);

    this.keyboard.state.cur_sequence = new_sequence;

    if (new_sequence) {
      keyboard.inputBuffer(new_sequence, 0xFFFFFF, 0x00FF00);
      debugLog(3, `rebuilt T9 sequence: "${new_sequence}" from word "${cur_word}"`);
    } else {
      keyboard.clearBuffer();
      debugLog(3, 'cleared T9 sequence (no word at cursor)');
    }

    this.keyboard.updateInputEmptyState();
  }

  insertTextAtCursor(text) {
    const before_cursor = this.keyboard.state.full_text.substring(0, this.keyboard.state.cursor_pos);
    const after_cursor = this.keyboard.state.full_text.substring(this.keyboard.state.cursor_pos);

    this.keyboard.state.full_text = before_cursor + text + after_cursor;
    this.keyboard.state.cursor_pos += text.length;

    keyboard.inputText(text);
    debugLog(3, `inserted "${text}" at cursor, new pos: ${this.keyboard.state.cursor_pos}`);
  }

  handleClearAll() {
    debugLog(3, 'clear all (long press)');

    this.keyboard.state.pending_char = '';
    this.keyboard.state.has_pending_char = false;
    this.keyboard.state.cur_sequence = '';
    this.keyboard.state.full_text = '';
    this.keyboard.state.is_in_multitap_mode = false;
    this.keyboard.state.cur_multitap_key = null;

    if (this.keyboard.state.multitap_timer) {
      clearTimeout(this.keyboard.state.multitap_timer);
      this.keyboard.state.multitap_timer = null;
    }

    keyboard.clearInput();
    this.keyboard.state.caps_mode = CAPS_MODES.FIRST;
    this.keyboard.keyboardRenderer.updateKeyboardVisuals();
    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();

    this.vibrate();
  }

  handleSpace() {
    debugLog(3, 'space pressed');
    this.keyboard.multitapHandler.commitPendingChar();

    const cursor_pos = this.keyboard.state.cursor_pos;
    const before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);
    const after_cursor = this.keyboard.state.full_text.substring(cursor_pos);
    this.keyboard.state.full_text = before_cursor + ' ' + after_cursor;
    this.keyboard.state.cursor_pos = cursor_pos + 1;
    keyboard.inputText(' ');
    this.keyboard.state.cur_sequence = '';
    debugLog(3, `inserted space at pos ${cursor_pos}, cleared t9 sequence, new cursor pos: ${this.keyboard.state.cursor_pos}`);

    if (this.keyboard.state.caps_mode === CAPS_MODES.OFF) {
      const text = this.keyboard.state.full_text;
      const len = text.length;
      if (len >= 2) {
        const last_char = text[len - 1];
        const second_last = text[len - 2];
        if (last_char === ' ' && (second_last === '.' || second_last === '!' || second_last === '?')) {
          this.keyboard.state.caps_mode = CAPS_MODES.FIRST;
          this.keyboard.keyboardRenderer.updateKeyboardVisuals();
        }
      }
    }

    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();
  }

  handleSelect() {
    debugLog(3, 'handling select - switching keyboard');

    this.keyboard.multitapHandler.commitPendingChar();

    keyboard.clearBuffer();
    this.keyboard.state.cur_sequence = '';

    keyboard.sendFnKey(keyboard.SELECT);
  }

  handleVoicePress() {
    debugLog(3, 'handling direct switch to VOICE');
    const is_voice_available = keyboard.checkVoiceInputAvailable();

    if (!is_voice_available) {
      debugLog(2, 'voice input not available');
      return;
    }

    this.keyboard.multitapHandler.commitPendingChar();
    keyboard.clearBuffer();
    this.keyboard.state.cur_sequence = '';
    keyboard.switchInputType(inputType.VOICE);
  }

  handleGlobeShortPress() {
    debugLog(3, 'globe short press - switching keyboard');
    this.keyboard.multitapHandler.commitPendingChar();

    this.syncFullTextToSystem();

    keyboard.clearBuffer();
    this.keyboard.state.cur_sequence = '';
    keyboard.sendFnKey(keyboard.SWITCH);
  }

  handleGlobeLongPress() {
    debugLog(3, 'globe long press - showing keyboard selector');
    this.keyboard.multitapHandler.commitPendingChar();

    this.syncFullTextToSystem();

    keyboard.clearBuffer();
    this.keyboard.state.cur_sequence = '';
    keyboard.sendFnKey(keyboard.SELECT);
  }

  handleSubmit() {
    debugLog(3, 'submit pressed - closing keyboard');
    this.keyboard.multitapHandler.commitPendingChar();
    this.syncFullTextToSystem();
    this.keyboard.state.cur_sequence = '';
    keyboard.sendFnKey(keyboard.ENTER);
  }

  handleCancel() {
    debugLog(3, 'cancel pressed - closing keyboard');
    keyboard.sendFnKey(keyboard.CANCEL);
  }

  syncFullTextToSystem() {
    const system_text = keyboard.getTextContext();

    if (system_text !== this.keyboard.state.full_text) {
      debugLog(3, `syncing full text to system: custom="${this.keyboard.state.full_text}", system="${system_text}"`);

      keyboard.clearInput();
      keyboard.inputText(this.keyboard.state.full_text);

      debugLog(3, `synced ${this.keyboard.state.full_text.length} chars to system keyboard`);
    }
  }

  selectCandidateByIndex(index) {
    const word = this.keyboard.state.candidates_arr[index];
    if (!word) return;

    const state = this.keyboard.state;
    const cursor_pos = state.cursor_pos;
    const full_text = state.full_text;

    let chars_to_remove = state.cur_sequence.length;
    if (state.has_pending_char) {
      chars_to_remove++;
    }

    state.pending_char = '';
    state.has_pending_char = false;
    state.is_in_multitap_mode = false;
    state.multitap_idx = 0;

    let word_start_pos = cursor_pos;
    while (word_start_pos > 0 && full_text[word_start_pos - 1] !== ' ') {
      word_start_pos--;
    }

    const text_before_word = full_text.substring(0, word_start_pos);
    const text_after_cursor = full_text.substring(cursor_pos);
    const actual_chars_to_remove = cursor_pos - word_start_pos;

    state.full_text = text_before_word + word + ' ' + text_after_cursor;
    state.cursor_pos = text_before_word.length + word.length + 1;

    keyboard.clearBuffer();
    if (actual_chars_to_remove > 0) {
      keyboard.backspace(actual_chars_to_remove);
    }
    keyboard.inputText(word + ' ');

    state.scroll_offset = 0;
    state.cur_sequence = '';
    this.keyboard.multitapHandler.updateCapsAfterChar();
    this.keyboard.updateKeyboardState();
    this.keyboard.updateInputEmptyState();

    debugLog(3, `selected "${word}", cleared buffer, state reset`);
  }

  applyWordCap(word) {
    const caps_mode = this.keyboard.state.caps_mode;

    if (caps_mode === CAPS_MODES.LOCK || caps_mode === CAPS_MODES.ON) {
      return word.toUpperCase();
    }

    if (caps_mode === CAPS_MODES.FIRST) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    const text = this.keyboard.state.full_text;
    const len = text.length;
    if (len === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    let has_punct = false;
    for (let i = len - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === ' ' || ch === '\t') {
        continue;
      }
      if (ch === '.' || ch === '!' || ch === '?') {
        has_punct = true;
      }
      break;
    }

    if (has_punct) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    return word.toLowerCase();
  }

  commitCurSeq() {
    if (this.keyboard.state.cur_sequence) {
      if (this.keyboard.state.candidates_arr.length > 0) {
        this.selectCandidateByIndex(0);
      } else {
        this.keyboard.state.full_text += this.keyboard.state.cur_sequence + ' ';
        keyboard.inputText(this.keyboard.state.cur_sequence + ' ');
        this.keyboard.state.cur_sequence = '';
      }
    }
  }

  syncWithSystemInput() {
    const system_text = keyboard.getTextContext();

    if (system_text !== this.keyboard.state.full_text) {
      debugLog(3, `syncing: system="${system_text}", custom="${this.keyboard.state.full_text}"`);
      this.keyboard.state.full_text = system_text;

      this.keyboard.state.cursor_pos = system_text.length;

      this.keyboard.state.cur_sequence = '';
      this.keyboard.state.pending_char = '';
      this.keyboard.state.has_pending_char = false;
      this.keyboard.state.is_in_multitap_mode = false;
      this.keyboard.state.cur_multitap_key = null;

      keyboard.clearBuffer();

      debugLog(3, `synced to system text: "${system_text}", cursor at ${this.keyboard.state.cursor_pos}`);

      this.keyboard.updateKeyboardState();
    }
  }

  // keep in mind that actions that trigger a keyboard content state change
  // like keyboard.inputText('a') produce vibration on their own. 
  // so it's unnecessary to apply custom vibration to them
  vibrate() {
    vibro.setMode(27); // VIBRATOR_SCENE_DURATION
    vibro.start();
  }
}