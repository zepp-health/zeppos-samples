// index.js
import { createWidget, widget } from '@zos/ui';
import { keyboard } from './modules/safe-keyboard';
import { styles } from 'zosLoader:./[name].[pf].layout.js'
import { t9_engine } from './engine/t9-engine';
import { KEYBOARD_MODES, CAPS_MODES, PREDICTION_DEBOUNCE, IS_DEBUG } from './modules/keyboard-config';
import { MultitapHandler } from './modules/multitap-handler';
import { InputFieldManager } from './modules/input-field-manager';
import { KeyboardRenderer } from './modules/keyboard-renderer';
import { KeyboardHandlers } from './modules/keyboard-handlers';
import { activateDefaults, debugLog, timeIt } from '../helpers/required';

DataWidget({
  state: {
    full_text: '',
    cur_sequence: '',
    candidates_arr: [],
    caps_mode: CAPS_MODES.FIRST,
    keyboard_mode: KEYBOARD_MODES.T9,

    is_debug: IS_DEBUG,

    cursor_pos: 0, // 0 = start, full_text.len = end

    // multitap state management
    cur_multitap_key: null,
    multitap_idx: 0,
    multitap_timer: null,
    longpress_timer: null,
    prediction_timer: null,
    lastkey_time: 0,
    pending_char: '',
    is_in_multitap_mode: false,
    has_pending_char: false,

    // submit/cancel
    is_input_empty: true,
    confirm_cancel_btn: null,

    ui: {
      input_field_widget: null,
      cursor_widget: null,
      input_overlay: null,
      candidate_widgets_arr: [],
      key_btns_arr: [],
      shift_btn: null,
      mode_btn: null,
      prediction_container: null,
      emoji_btns: null,
      smiley_btn: null,
      symbol_overlays: [],
    },

    is_scrolling_predictions: false,
    scroll_offset: 0,
  },

  onInit(params) {
    activateDefaults();
    if (params) {
      try {
        const parsed = JSON.parse(params);
        if (parsed.debug !== undefined) {
          this.state.is_debug = parsed.debug;
          debugLog(1, `keyboard started with debug=${this.state.is_debug}`);
        }
      } catch (e) {
        debugLog(4, `failed to parse params: ${e}`);
      }
    }
  },

  onResume() {
    // sync content with the internal/system keyboard
    const system_text = keyboard.getTextContext();

    if (system_text !== this.state.full_text) {
      this.state.full_text = system_text;
      this.state.cursor_pos = system_text.length;

      // clear T9 state
      this.state.cur_sequence = '';
      this.state.pending_char = '';
      this.state.has_pending_char = false;
      this.state.is_in_multitap_mode = false;
      this.state.cur_multitap_key = null;

      keyboard && keyboard.clearBuffer();
    }

    // sync UI
    if (this.inputFieldManager && this.keyboardRenderer) {
      this.inputFieldManager.updateSingleLineDisplay();
      this.keyboardRenderer.renderScrollablePredictions([]);
    }

    if (typeof this.updateInputEmptyState === 'function') {
      this.updateInputEmptyState();
    }
  },

  build() {
    // init managers
    this.multitapHandler = new MultitapHandler(this);
    this.inputFieldManager = new InputFieldManager(this, styles);
    this.keyboardRenderer = new KeyboardRenderer(this, styles);
    this.keyboardHandlers = new KeyboardHandlers(this);

    // calc cursor pos
    this.state.cursor_pos = this.state.full_text.length;

    // Layer 1: BG
    createWidget(widget.FILL_RECT, styles.bg_fill_rect);

    // Layer 2: Separator Lines
    const s = styles.new_separator;
    createWidget(widget.STROKE_RECT, s.top_sep);
    createWidget(widget.STROKE_RECT, s.bot_sep);

    this.state.ui.candidate_widgets_arr = [];

    // Layer 3: Input Field
    this.inputFieldManager.createSingleLineInputField();

    // Layer 4: Widgets
    this.keyboardRenderer.renderT9Grid();
    this.keyboardRenderer.renderIconButtons();

    // update state when everything is created
    this.keyboardRenderer.updateKeyboardVisuals();
    this.keyboardRenderer.updateConfirmCancelButton();
    this.updateKeyboardState();
  },

  updateKeyboardState() {
    timeIt('updateKeyboardState', () => {
      this.inputFieldManager.updateSingleLineDisplay();

      if (this.state.is_in_multitap_mode) return;

      if (this.state.prediction_timer) {
        clearTimeout(this.state.prediction_timer);
      }

      this.state.prediction_timer = setTimeout(() => {
        this.updatePredictions();
      }, PREDICTION_DEBOUNCE);
    });
  },

  updatePredictions() {
    if (this.state.keyboard_mode !== KEYBOARD_MODES.T9 || !this.state.cur_sequence) {
      this.state.candidates_arr = [];
      this.keyboardRenderer.renderScrollablePredictions([]);
      return;
    }

    const sequence = this.state.cur_sequence;
    const typed_pref = this.getTypedPrefixForSequence();

    t9_engine.getSuggestions(sequence, typed_pref, 5, (predictions) => {
      if (this.state.cur_sequence === sequence) {
        this.state.candidates_arr = predictions;
        this.keyboardRenderer.renderScrollablePredictions(predictions);
      }
    });
  },

  updateInputEmptyState() {
    const was_empty = this.state.is_input_empty;

    const is_now_empty = (
      this.state.full_text.length === 0 &&
      !this.state.has_pending_char &&
      this.state.cur_sequence.length === 0
    );

    if (was_empty !== is_now_empty) {
      this.state.is_input_empty = is_now_empty;
      this.keyboardRenderer.updateConfirmCancelButton();
      debugLog(3, `input empty state changed: ${is_now_empty}`);
    }
  },

  getTypedPrefixForSequence() {
    const seq_len = this.state.cur_sequence.length;
    const full_text = this.state.full_text;
    const text_len = full_text.length;
    let word_start = text_len;

    for (let i = text_len - 1; i >= 0; i--) {
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

    const cur_word_text = full_text.substring(word_start);
    let prefix = '';
    let letter_count = 0;

    for (let i = 0, len = cur_word_text.length; i < len && letter_count < seq_len; i++) {
      const char = cur_word_text[i];
      const code = char.charCodeAt(0);

      // char >= A && char <= Z || char >= a && char <= z
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        prefix += char;
        letter_count++;
      }
    }

    if (this.state.has_pending_char && this.state.pending_char) {
      const pending_display = this.multitapHandler.applyCapitalization(this.state.pending_char);
      prefix += pending_display;
    }

    return prefix;
  },

  onDestroy() {
    // clean up
    if (this.state.multitap_timer) {
      clearTimeout(this.state.multitap_timer);
      this.state.multitap_timer = null;
    }

    if (this.state.longpress_timer) {
      clearTimeout(this.state.longpress_timer);
      this.state.longpress_timer = null;
    }

    if (this.state.prediction_timer) {
      clearTimeout(this.state.prediction_timer);
      this.state.prediction_timer = null;
    }

    if (this.inputFieldManager && this.inputFieldManager.destroy) {
      this.inputFieldManager.destroy();
    }

    if (this.keyboardRenderer && this.keyboardRenderer.scroll_reset_timer) {
      clearTimeout(this.keyboardRenderer.scroll_reset_timer);
    }
  },
});