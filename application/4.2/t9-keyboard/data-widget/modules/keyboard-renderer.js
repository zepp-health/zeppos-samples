// modules/keyboard-renderer.js
import { createWidget, widget, prop, event, align, getImageInfo } from '@zos/ui';
import { px } from '@zos/utils';
import {
  KEYBOARD_MODES, CAPS_MODES, LONGPRESS_THRESHOLD, DEBOUNCE_TIME,
  EMOJI_MAP, NUMBER_SYMBOL_MAP, COLORS
} from './keyboard-config';
import { keyboard } from './safe-keyboard';
import { debugLog, DeviceInfo } from '../../helpers/required';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = DeviceInfo;
const IS_ROUND = DEVICE_WIDTH === DEVICE_HEIGHT;

export class KeyboardRenderer {
  constructor(keyboard, styles) {
    this.keyboard = keyboard;
    this.styles = styles;
  }

  renderT9Grid() {
    const grid = this.styles.t9_grid;
    const btn_w = (grid.w - (2 * grid.col_gap)) / 3;
    const btn_h = (grid.h - (3 * grid.row_gap)) / 4;
    const key_layout = [
      ['1.,?', '2abc', '3def'],
      ['4ghi', '5jkl', '6mno'],
      ['7pqrs', '8tuv', '9wxyz'],
      ['0', '', '*']
    ];

    this.keyboard.state.ui.key_btns_arr = [];
    this.keyboard.state.ui.key_grid_map = {};

    // number/letter text Y shift for square devices
    const sq_num_y_shift = !IS_ROUND ? px(8) : 0;
    const sq_let_y_shift = !IS_ROUND ? px(24) : 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const key = key_layout[row][col];
        if (!key) continue;

        const digit = key[0];
        const letters = key.substring(1);

        const btn_x = grid.x + col * (btn_w + grid.col_gap);
        const btn_y = grid.y + row * (btn_h + grid.row_gap);
        const full_btn_h = btn_h + sq_let_y_shift - sq_num_y_shift;

        const num_text = createWidget(widget.TEXT, {
          x: btn_x,
          y: btn_y + sq_num_y_shift,
          w: btn_w,
          h: px(20),
          color: 0x888888,
          text_size: px(16),
          text: digit,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
        });

        const letter_text = createWidget(widget.TEXT, {
          x: btn_x,
          y: btn_y + sq_let_y_shift,
          w: btn_w,
          h: btn_h,
          text: letters,
          text_size: this.styles.t9_key_btn.text_size,
          color: COLORS.WHITE,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
        });

        if (this.keyboard.state.is_debug) {
          const debug_border = createWidget(widget.STROKE_RECT, {
            x: btn_x,
            y: btn_y + sq_num_y_shift,
            w: btn_w,
            h: full_btn_h,
            line_width: 2,
            color: COLORS.DEBUG_DRAW,
          });

          if (!this.keyboard.state.ui.debug_btn_borders_arr) {
            this.keyboard.state.ui.debug_btn_borders_arr = [];
          }
          this.keyboard.state.ui.debug_btn_borders_arr.push(debug_border);
        }

        const touch_overlay = createWidget(widget.FILL_RECT, {
          x: btn_x,
          y: btn_y + sq_num_y_shift,
          w: btn_w,
          h: full_btn_h,
          alpha: 0
        });

        const key_data = {
          num_text,
          letter_text,
          touch_overlay,
          digit,
          letters,
          row,
          col,
          bounds: {
            x: btn_x,
            y: btn_y + sq_num_y_shift,
            w: btn_w,
            h: full_btn_h
          }
        };

        this.keyboard.state.ui.key_btns_arr.push(key_data);
        this.keyboard.state.ui.key_grid_map[`${row}_${col}`] = key_data;

        this.setupKeyTouchHandler(key_data);
      }
    }
  }

  setupKeyTouchHandler(key_data) {
    let press_start_time = 0;
    let is_long_press = false;
    let fade_timer = null;
    let is_pressed = false;

    const highlightKey = () => {
      key_data.touch_overlay.setProperty(prop.ALPHA, 60);
    };

    const fadeKey = () => {
      if (fade_timer) {
        clearTimeout(fade_timer);
      }

      let alpha = 60;
      const fade_step = () => {
        alpha -= 20;
        if (alpha <= 0) {
          key_data.touch_overlay.setProperty(prop.ALPHA, 0);
          fade_timer = null;
          return;
        }
        key_data.touch_overlay.setProperty(prop.ALPHA, alpha);
        fade_timer = setTimeout(fade_step, 16);
      };
      fade_step();
    };

    const cancelPress = () => {
      is_pressed = false;
      is_long_press = false;

      if (this.keyboard.state.longpress_timer) {
        clearTimeout(this.keyboard.state.longpress_timer);
        this.keyboard.state.longpress_timer = null;
      }

      fadeKey();
    };

    const handleShortPress = () => {
      if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.NUMBERS) {
        this.keyboard.keyboardHandlers.handleNumberPress(key_data.digit);
      } else if (key_data.digit === '1') {
        this.keyboard.multitapHandler.handleSymbolPress();
      } else if (key_data.digit === '0') {
        this.keyboard.keyboardHandlers.handleNumberPress('0');
      } else {
        this.keyboard.multitapHandler.handleT9KeyPress(key_data.digit);
      }
    };

    const handleLongPress = () => {
      this.keyboard.keyboardHandlers.handleNumberPress(key_data.digit);
    };

    key_data.touch_overlay.addEventListener(event.CLICK_DOWN, (info) => {
      if (is_pressed) return;

      is_pressed = true;
      press_start_time = Date.now();
      is_long_press = false;

      highlightKey();

      if (this.keyboard.state.longpress_timer) {
        clearTimeout(this.keyboard.state.longpress_timer);
      }

      this.keyboard.state.longpress_timer = setTimeout(() => {
        if (is_pressed) {
          is_long_press = true;
          handleLongPress();
          cancelPress();
        }
      }, LONGPRESS_THRESHOLD);
    });

    key_data.touch_overlay.addEventListener(event.MOVE, (info) => {
      if (!is_pressed) return;

      const bounds = key_data.bounds;
      const is_outside = info.x < bounds.x ||
        info.x > bounds.x + bounds.w ||
        info.y < bounds.y ||
        info.y > bounds.y + bounds.h;

      if (is_outside) {
        cancelPress();
      }
    });

    key_data.touch_overlay.addEventListener(event.CLICK_UP, (info) => {
      if (!is_pressed) return;

      const press_duration = Date.now() - press_start_time;

      if (this.keyboard.state.longpress_timer) {
        clearTimeout(this.keyboard.state.longpress_timer);
        this.keyboard.state.longpress_timer = null;
      }

      if (!is_long_press && press_duration < LONGPRESS_THRESHOLD) {
        const now = Date.now();
        if (now - this.keyboard.state.lastkey_time > DEBOUNCE_TIME) {
          handleShortPress();
          this.keyboard.state.lastkey_time = now;
        }
      }

      fadeKey();
      is_pressed = false;
      is_long_press = false;
    });
  }

  renderEmojiGrid() {
    const grid = this.styles.t9_grid;
    const btn_w = (grid.w - (2 * grid.col_gap)) / 3;
    const btn_h = (grid.h - (3 * grid.row_gap)) / 4;

    const key_btns = this.keyboard.state.ui.key_btns_arr;
    if (key_btns && key_btns.length > 0) {
      for (let i = 0, len = key_btns.length; i < len; i++) {
        const key_data = key_btns[i];
        if (key_data.num_text) key_data.num_text.setProperty(prop.VISIBLE, false);
        if (key_data.letter_text) key_data.letter_text.setProperty(prop.VISIBLE, false);
        if (key_data.touch_overlay) key_data.touch_overlay.setProperty(prop.VISIBLE, false);
      }
    }

    if (this.keyboard.state.is_debug) {
      const borders = this.keyboard.state.ui.debug_btn_borders_arr;
      if (borders) {
        for (let i = 0, len = borders.length; i < len; i++) {
          if (borders[i]) borders[i].setProperty(prop.VISIBLE, false);
        }
      }

      const overlays = this.keyboard.state.ui.symbol_overlays;
      if (overlays) {
        for (let i = 0, len = overlays.length; i < len; i++) {
          overlays[i].widget.setProperty(prop.VISIBLE, false);
        }
      }
    }

    if (!this.keyboard.state.ui.emoji_btns) {
      this.keyboard.state.ui.emoji_btns = [];
      for (let idx = 0, len = EMOJI_MAP.length; idx < len; idx++) {
        const emoji = EMOJI_MAP[idx];
        if (emoji === null) continue;

        const row = (idx / 3) | 0;
        const col = idx % 3;

        const emoji_btn = createWidget(widget.BUTTON, {
          ...this.styles.t9_key_btn,
          x: grid.x + col * (btn_w + grid.col_gap),
          y: grid.y + row * (btn_h + grid.row_gap),
          w: btn_w,
          h: btn_h,
          text: emoji,
          text_size: IS_ROUND ? px(28) : px(32),
        });

        this.keyboard.state.ui.emoji_btns.push(emoji_btn);
        this.setupUniversalButtonHandler(emoji_btn, emoji, () => {
          this.keyboard.keyboardHandlers.handleEmojiPress(emoji);
        });
      }
      debugLog(3, 'created emoji grid: 3 cols x 4 rows');
    } else {
      const btns = this.keyboard.state.ui.emoji_btns;
      for (let i = 0, len = btns.length; i < len; i++) {
        if (btns[i]) btns[i].setProperty(prop.VISIBLE, true);
      }
      debugLog(3, 'showed existing emoji buttons');
    }
  }

  hideEmojiGrid() {
    const emoji_btns = this.keyboard.state.ui.emoji_btns;
    if (emoji_btns) {
      for (let i = 0, len = emoji_btns.length; i < len; i++) {
        if (emoji_btns[i]) emoji_btns[i].setProperty(prop.VISIBLE, false);
      }
    }

    const key_btns = this.keyboard.state.ui.key_btns_arr;
    if (key_btns && key_btns.length > 0) {
      for (let i = 0, len = key_btns.length; i < len; i++) {
        const key_data = key_btns[i];
        if (key_data.num_text) {
          const is_t9_mode = this.keyboard.state.keyboard_mode === KEYBOARD_MODES.T9;
          key_data.num_text.setProperty(prop.VISIBLE, is_t9_mode);
        }
        if (key_data.letter_text) key_data.letter_text.setProperty(prop.VISIBLE, true);
        if (key_data.touch_overlay) key_data.touch_overlay.setProperty(prop.VISIBLE, true);
      }
    }

    if (this.keyboard.state.is_debug) {
      const borders = this.keyboard.state.ui.debug_btn_borders_arr;
      if (borders) {
        for (let i = 0, len = borders.length; i < len; i++) {
          if (borders[i]) borders[i].setProperty(prop.VISIBLE, true);
        }
      }
    }
  }

  renderIconButtons() {
    const icons = this.styles.icons;
    const createIconButton = (icon_style, short_press_handler, long_press_handler = null) => {
      const img = createWidget(widget.IMG, icon_style);
      this.setupUniversalButtonHandler(img, icon_style.src, short_press_handler, long_press_handler);
      return img;
    };

    // mode (numbers/T9 toggle)
    this.keyboard.state.ui.mode_btn = createWidget(widget.IMG, icons.numbers);
    this.setupUniversalButtonHandler(
      this.keyboard.state.ui.mode_btn,
      'mode',
      () => this.keyboard.keyboardHandlers.handleModeSwitch()
    );

    // voice
    const is_voice_available = keyboard.checkVoiceInputAvailable();

    const voice_icon_config = is_voice_available
      ? icons.voice
      : {
        ...icons.voice,
        src: 'kb_icons/no_voice.png'
      };

    createIconButton(voice_icon_config, () => {
      if (is_voice_available) {
        this.keyboard.keyboardHandlers.handleVoicePress();
      }
    });

    // shift
    const shift_config = icons.shift_off;
    const shift_img_info = getImageInfo(shift_config.src);
    const shift_trigger_scale_h = 1.5;
    const shift_trigger_scale_w = 2.0;

    const shift_trigger_w = Math.round(shift_img_info.width * shift_trigger_scale_w);
    const shift_trigger_h = Math.round(shift_img_info.height * shift_trigger_scale_h);
    const shift_trigger_x = shift_config.x - Math.round((shift_trigger_w - shift_img_info.width) / 2);
    const shift_trigger_y = shift_config.y - Math.round((shift_trigger_h - shift_img_info.height) / 2);

    if (this.keyboard.state.is_debug) {
      if (!this.keyboard.state.ui.debug_shift_border) {
        this.keyboard.state.ui.debug_shift_border = createWidget(widget.STROKE_RECT, {
          x: shift_trigger_x,
          y: shift_trigger_y,
          w: shift_trigger_w,
          h: shift_trigger_h,
          line_width: 2,
          color: COLORS.DEBUG_DRAW,
        });
      }
    }

    this.keyboard.state.ui.shift_btn = createWidget(widget.IMG, shift_config);

    const shift_overlay = createWidget(widget.FILL_RECT, {
      x: shift_trigger_x,
      y: shift_trigger_y,
      w: shift_trigger_w,
      h: shift_trigger_h,
      alpha: 0
    });

    this.keyboard.state.ui.shift_trigger_info = {
      x: shift_trigger_x,
      y: shift_trigger_y,
      w: shift_trigger_w,
      h: shift_trigger_h,
      img_w: shift_img_info.width,
      img_h: shift_img_info.height,
      overlay: shift_overlay,
      scale_w: shift_trigger_scale_w,
      scale_h: shift_trigger_scale_h
    };

    this.setupUniversalButtonHandler(
      shift_overlay, // handler on the overlay
      'shift',
      () => this.keyboard.keyboardHandlers.handleShift(),
      () => this.keyboard.keyboardHandlers.handleCapsLock()
    );

    // backspace
    createIconButton(
      icons.backspace,
      () => this.keyboard.keyboardHandlers.handleBackspace(),
      () => this.keyboard.keyboardHandlers.handleClearAll()
    );

    // smiley/emoji
    this.keyboard.state.ui.smiley_btn = createWidget(widget.IMG, icons.smiley);
    this.setupUniversalButtonHandler(
      this.keyboard.state.ui.smiley_btn,
      'smiley',
      () => this.keyboard.keyboardHandlers.handleEmojiMode()
    );

    // confirm/cancel
    const is_empty = this.keyboard.state.is_input_empty;
    const icon_config = is_empty ? icons.cancel : icons.confirm;

    this.keyboard.state.ui.confirm_cancel_btn = createWidget(widget.IMG, icon_config);
    this.setupUniversalButtonHandler(
      this.keyboard.state.ui.confirm_cancel_btn,
      'confirm_cancel',
      () => {
        if (this.keyboard.state.full_text && this.keyboard.state.full_text.length > 0) {
          this.keyboard.keyboardHandlers.handleSubmit();
        } else {
          this.keyboard.keyboardHandlers.handleCancel();
        }
      }
    );

    // globe
    createIconButton(
      icons.globe,
      () => this.keyboard.keyboardHandlers.handleGlobeShortPress(),
      () => this.keyboard.keyboardHandlers.handleGlobeLongPress()
    );

    // space
    createIconButton(
      icons.space,
      () => this.keyboard.keyboardHandlers.handleSpace(),
      () => this.keyboard.keyboardHandlers.handleSpace()
    );
  }

  createSymbolOverlays() {
    const grid = this.styles.t9_grid;
    const btn_w = (grid.w - (2 * grid.col_gap)) / 3;
    const btn_h = (grid.h - (3 * grid.row_gap)) / 4;

    const sq_num_y_shift = !IS_ROUND ? px(8) : 0;

    this.keyboard.state.ui.symbol_overlays = [];

    const key_layout = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['0', '', '*']
    ];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const digit = key_layout[row][col];
        if (!digit) continue;

        const symbols = NUMBER_SYMBOL_MAP[digit];
        if (!symbols || symbols.length === 0) continue;

        const symbols_only = symbols.slice(1);
        const symbol_text = symbols_only.join('');

        const symbol_overlay = createWidget(widget.TEXT, {
          x: grid.x + col * (btn_w + grid.col_gap),
          y: grid.y + row * (btn_h + grid.row_gap) + sq_num_y_shift,
          w: btn_w,
          h: px(20),
          color: 0x888888,
          text_size: px(16),
          text: symbol_text,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
        });

        this.keyboard.state.ui.symbol_overlays.push({
          widget: symbol_overlay,
          digit: digit,
          symbols: symbols,
          symbols_only: symbols_only,
          all_text: symbol_text
        });
      }
    }

    const key_btns = this.keyboard.state.ui.key_btns_arr;
    if (key_btns && key_btns.length > 0) {
      for (let i = 0, len = key_btns.length; i < len; i++) {
        const key_data = key_btns[i];

        if (key_data.touch_overlay) {
          key_data.touch_overlay.setProperty(prop.VISIBLE, false);
        }

        key_data.touch_overlay = createWidget(widget.FILL_RECT, {
          x: key_data.bounds.x,
          y: key_data.bounds.y,
          w: key_data.bounds.w,
          h: key_data.bounds.h,
          alpha: 0
        });

        this.setupKeyTouchHandler(key_data);
      }
    }

    debugLog(3, 'created symbol overlays for numbers mode');
  }

  renderScrollablePredictions(predictions) {
    if (!predictions || predictions.length === 0) {
      const widgets = this.keyboard.state.ui.prediction_widgets;
      if (widgets) {
        for (let i = 0, len = widgets.length; i < len; i++) {
          const widget_obj = widgets[i];
          if (widget_obj.bg) widget_obj.bg.setProperty(prop.VISIBLE, false);
          if (widget_obj.text) widget_obj.text.setProperty(prop.VISIBLE, false);
        }
      }
      if (this.keyboard.state.ui.prediction_touch_overlay) {
        this.keyboard.state.ui.prediction_touch_overlay.setProperty(prop.VISIBLE, false);
      }
      // hide debug border when no predictions
      if (this.keyboard.state.is_debug && this.keyboard.state.ui.debug_pred_border) {
        this.keyboard.state.ui.debug_pred_border.setProperty(prop.VISIBLE, false);
      }
      return;
    }

    const pred_count = predictions.length;
    const display_count = pred_count < 5 ? pred_count : 5;
    const btn_width = 85;
    const btn_height = 32;
    const btn_gap = 8;
    const side_margin = 50;

    const container_w = this.styles.prediction_bar.w;
    const container_h = this.styles.prediction_bar.h;
    const container_x = this.styles.prediction_bar.x;
    const container_y = this.styles.prediction_bar.y;

    let available_width;

    if (IS_ROUND) {
      const screen_radius = DEVICE_WIDTH / 2;
      const prediction_y = container_y + (container_h >> 1);
      const dy = prediction_y - screen_radius;
      const distance_from_center = dy > 0 ? dy : -dy;
      const safe_width = (screen_radius * screen_radius - distance_from_center * distance_from_center) ** 0.5 * 2;
      available_width = safe_width - 40;
    } else {
      available_width = container_w + Math.floor(DEVICE_WIDTH / 2);
    }

    const start_x = container_x + ((container_w - available_width) >> 1);
    const scroll_offset = this.keyboard.state.scroll_offset || 0;
    const final_overlay_x = start_x + scroll_offset;
    const total_content_w = display_count * (btn_width + btn_gap) - btn_gap;
    const overlay_w = total_content_w + (side_margin << 1);

    const touch_overlay_w = IS_ROUND ? container_w : available_width;
    const touch_overlay_x = IS_ROUND ? container_x : start_x;
    const touch_overlay_h = container_h;
    const touch_overlay_y = container_y;

    if (this.keyboard.state.is_debug) {
      if (!this.keyboard.state.ui.debug_pred_border) {
        this.keyboard.state.ui.debug_pred_border = createWidget(widget.STROKE_RECT, {
          x: touch_overlay_x,
          y: touch_overlay_y,
          w: touch_overlay_w,
          h: touch_overlay_h,
          line_width: 2,
          color: COLORS.DEBUG_DRAW,
        });
      } else {
        this.keyboard.state.ui.debug_pred_border.setProperty(prop.MORE, {
          x: touch_overlay_x,
          y: touch_overlay_y,
          w: touch_overlay_w,
          h: touch_overlay_h,
        });
        this.keyboard.state.ui.debug_pred_border.setProperty(prop.VISIBLE, true);
      }
    }

    if (!this.keyboard.state.ui.prediction_widgets) {
      this.keyboard.state.ui.prediction_widgets = [];
    }

    for (let idx = 0; idx < display_count; idx++) {
      const prediction = predictions[idx];
      const is_first_btn = idx === 0;
      const btn_x = final_overlay_x + side_margin + idx * (btn_width + btn_gap);
      const btn_y = container_y + ((container_h - btn_height) >> 1);

      let widget_obj = this.keyboard.state.ui.prediction_widgets[idx];
      if (!widget_obj) {
        const btn_bg = createWidget(widget.FILL_RECT, {
          x: btn_x,
          y: btn_y,
          w: btn_width,
          h: btn_height,
          color: is_first_btn ? 0x252525 : 0x1B1B1B,
        });

        const btn_text = createWidget(widget.TEXT, {
          x: btn_x,
          y: btn_y,
          w: btn_width,
          h: btn_height,
          text: prediction,
          text_size: px(15),
          color: is_first_btn ? COLORS.WHITE : 0xA7A7A7,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V
        });

        let btn_debug_border = null;
        if (this.keyboard.state.is_debug) {
          btn_debug_border = createWidget(widget.STROKE_RECT, {
            x: btn_x,
            y: container_y,
            w: btn_width,
            h: container_h,
            line_width: 2,
            color: COLORS.BLUE,
          });
        }

        this.keyboard.state.ui.prediction_widgets[idx] = {
          bg: btn_bg,
          text: btn_text,
          debug_border: btn_debug_border,
          prediction,
          index: idx
        };
      } else {
        widget_obj.bg.setProperty(prop.MORE, {
          x: btn_x,
          y: btn_y,
          w: btn_width,
          h: btn_height,
          color: is_first_btn ? 0x252525 : 0x1B1B1B,
        });
        widget_obj.bg.setProperty(prop.VISIBLE, true);

        widget_obj.text.setProperty(prop.MORE, {
          x: btn_x,
          y: btn_y,
          text: prediction,
          color: is_first_btn ? COLORS.WHITE : 0xA7A7A7,
        });
        widget_obj.text.setProperty(prop.VISIBLE, true);

        if (this.keyboard.state.is_debug && widget_obj.debug_border) {
          widget_obj.debug_border.setProperty(prop.MORE, {
            x: btn_x,
            y: container_y,
            w: btn_width,
            h: container_h,
          });
          widget_obj.debug_border.setProperty(prop.VISIBLE, true);
        }

        widget_obj.prediction = prediction;
        widget_obj.index = idx;
      }
    }

    const widgets = this.keyboard.state.ui.prediction_widgets;
    for (let i = display_count, len = widgets.length; i < len; i++) {
      const widget_obj = widgets[i];
      if (widget_obj) {
        if (widget_obj.bg) widget_obj.bg.setProperty(prop.VISIBLE, false);
        if (widget_obj.text) widget_obj.text.setProperty(prop.VISIBLE, false);
        if (this.keyboard.state.is_debug && widget_obj.debug_border) {
          widget_obj.debug_border.setProperty(prop.VISIBLE, false);
        }
      }
    }

    if (!this.keyboard.state.ui.prediction_touch_overlay) {
      this.keyboard.state.ui.prediction_touch_overlay = createWidget(widget.FILL_RECT, {
        x: touch_overlay_x,
        y: touch_overlay_y,
        w: touch_overlay_w,
        h: touch_overlay_h,
        alpha: 0,
      });
      this.setupPredictionTouchHandlers(this.keyboard.state.ui.prediction_touch_overlay);
      debugLog(3, `created prediction overlay at x=${touch_overlay_x}, y=${touch_overlay_y}, w=${touch_overlay_w}, h=${touch_overlay_h}`);
    } else {
      this.keyboard.state.ui.prediction_touch_overlay.setProperty(prop.MORE, {
        x: touch_overlay_x,
        y: touch_overlay_y,
        w: touch_overlay_w,
        h: touch_overlay_h,
      });
      this.keyboard.state.ui.prediction_touch_overlay.setProperty(prop.VISIBLE, true);
      debugLog(3, `updated prediction overlay to x=${touch_overlay_x}, y=${touch_overlay_y}, w=${touch_overlay_w}, h=${touch_overlay_h}`);
    }

    this.keyboard.state.ui.prediction_layout = {
      overlay_x: final_overlay_x,
      overlay_y: container_y,
      btn_y: container_y + ((container_h - btn_height) >> 1),
      overlay_w,
      overlay_h: container_h,
      btn_height,
      side_margin,
      btn_width,
      btn_gap,
      container_x: touch_overlay_x
    };
  }

  createPredictionTouchOverlay() {
    const container_x = this.styles.prediction_bar.x;
    const container_y = this.styles.prediction_bar.y;
    const container_w = this.styles.prediction_bar.w;
    const container_h = this.styles.prediction_bar.h;

    this.keyboard.state.ui.prediction_touch_overlay = createWidget(widget.FILL_RECT, {
      x: container_x,
      y: container_y,
      w: container_w,
      h: container_h,
      alpha: 0,
    });

    this.setupPredictionTouchHandlers(this.keyboard.state.ui.prediction_touch_overlay, []);
  }

  handlePredictionScroll(delta_x) {
    const btn_width = 85;
    const btn_gap = 8;
    const candidates = this.keyboard.state.candidates_arr;
    const total_w = candidates.length * (btn_width + btn_gap) - btn_gap;

    const container_h = this.styles.prediction_bar.h;
    const container_y = this.styles.prediction_bar.y;

    let available_width;

    if (IS_ROUND) {
      const screen_radius = DEVICE_WIDTH / 2;
      const prediction_y = container_y + (container_h >> 1);
      const dy = prediction_y - screen_radius;
      const distance_from_center = dy > 0 ? dy : -dy;
      const safe_width = (screen_radius * screen_radius - distance_from_center * distance_from_center) ** 0.5 * 2;
      available_width = safe_width - 40;
    } else {
      available_width = this.styles.prediction_bar.w + Math.floor(DEVICE_WIDTH / 2);
    }

    const max_scroll = total_w - available_width;
    const max_scroll_clamped = max_scroll > 0 ? max_scroll : 0;

    let new_offset = (this.keyboard.state.scroll_offset || 0) + delta_x;
    const neg_max = -max_scroll_clamped;
    if (new_offset < neg_max) new_offset = neg_max;
    if (new_offset > 0) new_offset = 0;

    this.keyboard.state.scroll_offset = new_offset;

    const container_w = this.styles.prediction_bar.w;
    const container_x = this.styles.prediction_bar.x;
    const start_x = container_x + ((container_w - available_width) >> 1);
    const final_overlay_x = start_x + new_offset;

    const side_margin = 50;
    const btn_height = 32;

    const widgets = this.keyboard.state.ui.prediction_widgets;
    if (widgets) {
      for (let idx = 0, len = widgets.length; idx < len; idx++) {
        const widget_obj = widgets[idx];
        if (widget_obj && widget_obj.bg && widget_obj.text) {
          const btn_x = final_overlay_x + side_margin + idx * (btn_width + btn_gap);
          const btn_y = container_y + ((container_h - btn_height) >> 1);

          widget_obj.bg.setProperty(prop.MORE, {
            x: btn_x,
            y: btn_y,
            w: btn_width,
            h: btn_height,
            color: idx === 0 ? 0x252525 : 0x1B1B1B
          });

          widget_obj.text.setProperty(prop.MORE, {
            x: btn_x,
            y: btn_y
          });

          if (this.keyboard.state.is_debug && widget_obj.debug_border) {
            widget_obj.debug_border.setProperty(prop.MORE, {
              x: btn_x,
              y: container_y,
              w: btn_width,
              h: container_h,
            });
          }
        }
      }
    }

    if (this.keyboard.state.ui.prediction_layout) {
      this.keyboard.state.ui.prediction_layout.overlay_x = final_overlay_x;
    }
  }

  handlePredictionTap(tap_x, tap_y) {
    const layout = this.keyboard.state.ui.prediction_layout;
    if (!layout) return;

    const candidates = this.keyboard.state.candidates_arr;
    const pred_count = candidates.length;
    const display_count = pred_count < 5 ? pred_count : 5;
    if (display_count === 0) return;

    // using full container height instead of virtual btn_h (UX improvement)
    const container_y = layout.overlay_y;
    const container_h = layout.overlay_h;
    if (tap_y < container_y || tap_y > container_y + container_h) return;

    const btn_area_start_x = layout.overlay_x + layout.side_margin;
    const tap_relative_to_btns = tap_x - btn_area_start_x;

    if (tap_relative_to_btns >= 0) {
      const total_btns_w = display_count * (layout.btn_width + layout.btn_gap) - layout.btn_gap;
      if (tap_relative_to_btns <= total_btns_w) {
        const btn_idx = (tap_relative_to_btns / (layout.btn_width + layout.btn_gap)) | 0;
        if (btn_idx >= 0 && btn_idx < display_count) {
          const btn_start_in_area = btn_idx * (layout.btn_width + layout.btn_gap);
          const btn_end_in_area = btn_start_in_area + layout.btn_width;
          if (tap_relative_to_btns >= btn_start_in_area && tap_relative_to_btns <= btn_end_in_area) {
            this.keyboard.keyboardHandlers.selectCandidateByIndex(btn_idx);
          }
        }
      }
    }
  }

  setupPredictionTouchHandlers(overlay) {
    let start_x = null;
    let start_time = null;
    const swipe_threshold = 15;
    const tap_time_threshold = 300;

    if (this.keyboard.state.is_debug && !this.keyboard.state.ui.debug_click_indicators) {
      this.keyboard.state.ui.debug_click_indicators = [];
    }

    overlay.addEventListener(event.CLICK_DOWN, (info) => {
      start_x = info.x;
      start_time = Date.now();

      debugLog(3, `prediction CLICK_DOWN at x=${info.x}, y=${info.y}`);

      if (this.keyboard.state.is_debug) {
        setTimeout(() => {
          const indicator = createWidget(widget.CIRCLE, {
            center_x: info.x,
            center_y: info.y,
            radius: 6,
            color: COLORS.DEBUG_DRAW,
            alpha: 200
          });

          this.keyboard.state.ui.debug_click_indicators.push(indicator);

          setTimeout(() => {
            const idx = this.keyboard.state.ui.debug_click_indicators.indexOf(indicator);
            if (idx >= 0) {
              this.keyboard.state.ui.debug_click_indicators.splice(idx, 1);
            }
            try {
              indicator.setProperty(prop.VISIBLE, false);
            } catch (e) {
              debugLog(4, `indicator cleanup error: ${e}`);
            }
          }, 2000);
        }, 0);
      }
    });

    overlay.addEventListener(event.MOVE, (info) => {
      if (start_x !== null) {
        const delta_x = info.x - start_x;
        const abs_delta = delta_x > 0 ? delta_x : -delta_x;
        if (abs_delta > swipe_threshold) {
          debugLog(3, `prediction scroll delta=${delta_x}`);
          this.handlePredictionScroll(delta_x);
          start_x = info.x;
        }
      }
    });

    overlay.addEventListener(event.CLICK_UP, (info) => {
      const end_time = Date.now();
      const duration = end_time - (start_time || end_time);

      debugLog(3, `prediction CLICK_UP at x=${info.x}, y=${info.y}, duration=${duration}ms`);

      if (start_x !== null && duration < tap_time_threshold) {
        const delta = info.x - start_x;
        const abs_delta = delta > 0 ? delta : -delta;
        if (abs_delta < swipe_threshold) {
          debugLog(3, `prediction tap detected at x=${info.x}, y=${info.y}`);
          this.handlePredictionTap(info.x, info.y);
        } else {
          debugLog(3, `swipe detected, delta=${abs_delta}px > threshold=${swipe_threshold}px`);
        }
      } else {
        debugLog(3, `not a tap: start_x=${start_x}, duration=${duration}ms`);
      }

      start_x = null;
      start_time = null;
    });
  }

  updateConfirmCancelButton() {
    if (!this.keyboard.state.ui.confirm_cancel_btn) return;

    const is_empty = this.keyboard.state.is_input_empty;
    const icon_src = is_empty
      ? this.styles.icons.cancel.src
      : this.styles.icons.confirm.src;

    this.keyboard.state.ui.confirm_cancel_btn.setProperty(prop.SRC, icon_src);
    debugLog(3, `updated confirm/cancel button: ${is_empty ? 'cancel' : 'confirm'}`);
  }

  updateKeyboardVisuals() {
    if (this.keyboard.state.keyboard_mode === KEYBOARD_MODES.EMOJI) {
      this.renderEmojiGrid();
      if (this.keyboard.state.ui.smiley_btn) {
        const smiley_cfg = this.styles.icons.smiley;
        const emoji_info = getImageInfo(this.styles.icons.smiley.src);
        const t9_info = getImageInfo(this.styles.icons.t9.src);
        const offset_x = ((emoji_info.width - t9_info.width) >> 1);
        const offset_y = ((emoji_info.height - t9_info.height) >> 1);
        this.keyboard.state.ui.smiley_btn.setProperty(prop.MORE, {
          x: smiley_cfg.x + px(offset_x),
          y: smiley_cfg.y + px(offset_y),
          src: this.styles.icons.t9.src
        });
      }

      if (this.keyboard.state.ui.mode_btn) {
        const numbers_cfg = this.styles.icons.numbers;
        this.keyboard.state.ui.mode_btn.setProperty(prop.MORE, {
          x: numbers_cfg.x,
          y: numbers_cfg.y,
          src: this.styles.icons.numbers.src
        });
        this.keyboard.state.ui.mode_btn.setProperty(prop.VISIBLE, true);
      }

      return;
    }

    this.hideEmojiGrid();

    if (this.keyboard.state.ui.smiley_btn) {
      const smiley_cfg = this.styles.icons.smiley;
      this.keyboard.state.ui.smiley_btn.setProperty(prop.MORE, {
        x: smiley_cfg.x,
        y: smiley_cfg.y,
        src: this.styles.icons.smiley.src
      });
    }

    const key_btns = this.keyboard.state.ui.key_btns_arr;
    if (key_btns && key_btns.length > 0) {
      const is_numbers = this.keyboard.state.keyboard_mode === KEYBOARD_MODES.NUMBERS;

      for (let i = 0, len = key_btns.length; i < len; i++) {
        const key_data = key_btns[i];

        if (is_numbers) {
          if (key_data.letter_text) {
            key_data.letter_text.setProperty(prop.TEXT, key_data.digit);
          }
          if (key_data.num_text) {
            key_data.num_text.setProperty(prop.VISIBLE, false);
          }

          if (!this.keyboard.state.ui.symbol_overlays || this.keyboard.state.ui.symbol_overlays.length === 0) {
            this.createSymbolOverlays();
          } else {
            const overlays = this.keyboard.state.ui.symbol_overlays;
            for (let j = 0, olen = overlays.length; j < olen; j++) {
              overlays[j].widget.setProperty(prop.VISIBLE, true);
            }
          }

          if (this.keyboard.state.ui.mode_btn) {
            const numbers_cfg = this.styles.icons.numbers;
            const num_info = getImageInfo(this.styles.icons.numbers.src);
            const t9_info = getImageInfo(this.styles.icons.t9.src);
            const offset_x = ((num_info.width - t9_info.width) >> 1);
            const offset_y = -1;
            this.keyboard.state.ui.mode_btn.setProperty(prop.MORE, {
              x: numbers_cfg.x + px(offset_x),
              y: numbers_cfg.y + px(offset_y),
              src: this.styles.icons.t9.src
            });
          }
        } else {
          let letters = key_data.letters || '';

          if (letters) {
            const caps = this.keyboard.state.caps_mode;
            if (caps === CAPS_MODES.ON || caps === CAPS_MODES.LOCK || caps === CAPS_MODES.FIRST) {
              letters = letters.toUpperCase();
            } else {
              letters = letters.toLowerCase();
            }
            if (key_data.letter_text) {
              key_data.letter_text.setProperty(prop.TEXT, letters);
            }
          }
          if (key_data.num_text) {
            key_data.num_text.setProperty(prop.VISIBLE, true);
          }

          const overlays = this.keyboard.state.ui.symbol_overlays;
          if (overlays) {
            for (let j = 0, olen = overlays.length; j < olen; j++) {
              overlays[j].widget.setProperty(prop.VISIBLE, false);
            }
          }

          if (this.keyboard.state.ui.mode_btn) {
            const numbers_cfg = this.styles.icons.numbers;
            this.keyboard.state.ui.mode_btn.setProperty(prop.MORE, {
              x: numbers_cfg.x,
              y: numbers_cfg.y,
              src: this.styles.icons.numbers.src
            });
          }
        }
      }
    }

    if (this.keyboard.state.ui.shift_btn) {
      let shift_icon;
      const caps = this.keyboard.state.caps_mode;
      if (caps === CAPS_MODES.OFF) {
        shift_icon = this.styles.icons.shift_off.src;
      } else if (caps === CAPS_MODES.FIRST || caps === CAPS_MODES.ON) {
        shift_icon = this.styles.icons.shift_on.src;
      } else {
        shift_icon = this.styles.icons.shift_caps.src;
      }
      this.keyboard.state.ui.shift_btn.setProperty(prop.SRC, shift_icon);

      if (this.keyboard.state.is_debug && this.keyboard.state.ui.debug_shift_border && this.keyboard.state.ui.shift_trigger_info) {
        const new_img_info = getImageInfo(shift_icon);
        const trigger_info = this.keyboard.state.ui.shift_trigger_info;

        const new_trigger_w = Math.round(new_img_info.width * trigger_info.scale_w);
        const new_trigger_h = Math.round(new_img_info.height * trigger_info.scale_h);
        const shift_config = caps === CAPS_MODES.OFF ? this.styles.icons.shift_off :
          (caps === CAPS_MODES.LOCK ? this.styles.icons.shift_caps : this.styles.icons.shift_on);
        const new_trigger_x = shift_config.x - Math.round((new_trigger_w - new_img_info.width) / 2);
        const new_trigger_y = shift_config.y - Math.round((new_trigger_h - new_img_info.height) / 2);

        this.keyboard.state.ui.debug_shift_border.setProperty(prop.MORE, {
          x: new_trigger_x,
          y: new_trigger_y,
          w: new_trigger_w,
          h: new_trigger_h,
        });

        if (this.keyboard.state.ui.shift_trigger_info.overlay) {
          this.keyboard.state.ui.shift_trigger_info.overlay.setProperty(prop.MORE, {
            x: new_trigger_x,
            y: new_trigger_y,
            w: new_trigger_w,
            h: new_trigger_h,
          });
        }
      }
    }
  }

  setupUniversalButtonHandler(btn_widget, key_id, short_press_cb, long_press_cb = null) {
    let press_start_time = 0;
    let is_pressed = false;

    btn_widget.addEventListener(event.CLICK_DOWN, () => {
      if (is_pressed) return;

      is_pressed = true;
      press_start_time = Date.now();

      if (long_press_cb) {
        this.keyboard.state.longpress_timer = setTimeout(() => {
          if (is_pressed) {
            long_press_cb();
            is_pressed = false;
          }
        }, LONGPRESS_THRESHOLD);
      }
    });

    btn_widget.addEventListener(event.CLICK_UP, () => {
      if (!is_pressed) return;

      is_pressed = false;
      const press_duration = Date.now() - press_start_time;

      if (this.keyboard.state.longpress_timer) {
        clearTimeout(this.keyboard.state.longpress_timer);
        this.keyboard.state.longpress_timer = null;
      }

      if (press_duration < LONGPRESS_THRESHOLD) {
        const now = Date.now();
        if (now - this.keyboard.state.lastkey_time > DEBOUNCE_TIME) {
          short_press_cb();
          this.keyboard.state.lastkey_time = now;
        }
      }
    });
  }

  createScrollablePredictionBar() {
    const bar = this.styles.prediction_bar;

    const prediction_container = createWidget(widget.VIEW_CONTAINER, {
      x: bar.x,
      y: bar.y,
      w: bar.w,
      h: bar.h,
      scroll_enable: 1,
      horizontal: true,
      scroll_frame_func: (frame_params) => {
        const scroll_offset = Math.abs(frame_params.xoffset || 0);

        if (scroll_offset > 5) {
          this.keyboard.state.is_scrolling_predictions = true;

          clearTimeout(this.scroll_reset_timer);
          this.scroll_reset_timer = setTimeout(() => {
            this.keyboard.state.is_scrolling_predictions = false;
          }, 500);
        }
      },
      scroll_complete_func: () => {
        setTimeout(() => {
          this.keyboard.state.is_scrolling_predictions = false;
        }, 100);
      }
    });

    this.keyboard.state.ui.prediction_container = prediction_container;
    this.keyboard.state.ui.candidate_widgets_arr = [];

    return prediction_container;
  }
}