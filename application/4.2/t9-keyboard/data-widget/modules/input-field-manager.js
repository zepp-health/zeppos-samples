// modules/input-field-manager.js
import { createWidget, widget, prop, event, text_style } from '@zos/ui';
import { px } from '@zos/utils';
import { debugLog, DeviceInfo, timeIt } from '../../helpers/required';
import { getScaledWidths } from './font-atlas.js';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = DeviceInfo;
const IS_ROUND = DEVICE_WIDTH === DEVICE_HEIGHT;
const ELLIPSIS_CHAR = '…';

export class InputFieldManager {
  constructor(keyboard, styles) {
    this.keyboard = keyboard;
    this.blink_timer = null;
    this.cursor_visible = true;
    this.last_activity_time = 0;
    this.styles = styles;

    this.cached_display_info = null;
    this.last_cache_key = '';

    this.last_rendered_text = '';
    this.last_rendered_cursor_x = -1;

    const backspace_x = styles.icons.backspace.x;
    const input_x = styles.input_field.x;
    const safe_margin = px(4);

    this.max_width = backspace_x - input_x - safe_margin;

    // char width cache
    const widths = getScaledWidths(styles.input_field.text_size);
    this.char_width_cache = widths.CHAR_WIDTH_MAP;
    this.space_width = widths.SPACE_WIDTH;
    this.emoji_width = widths.EMOJI_WIDTH;
    this.ellipsis_width = widths.ELLIPSIS_WIDTH;
    this.avg_char_width = widths.AVG_CHAR_WIDTH;
  }

  calcTextWidth(text) {
    let width = 0;
    const len = text.length;
    let i = 0;

    while (i < len) {
      const code = text.charCodeAt(i);
      // 0xD800-0xDBFF = start of emoji
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < len) {
        const next_code = text.charCodeAt(i + 1);
        // 0xDC00-0xDFFF = end of emoji
        if (next_code >= 0xDC00 && next_code <= 0xDFFF) {
          width += this.emoji_width;
          i += 2;
          continue;
        }
      }
      width += this.getCharWidth(text[i]);
      i++;
    }
    return width;
  }

  getCharWidth(c) {
    if (c === ' ') return this.space_width;
    if (c === ELLIPSIS_CHAR) return this.ellipsis_width;
    const cached = this.char_width_cache[c];
    return cached !== undefined ? cached : this.avg_char_width;
  }

  createSingleLineInputField() {
    this.keyboard.state.ui.input_field_widget = createWidget(widget.TEXT, {
      ...this.styles.input_field,
      w: this.max_width,
      text_style: text_style.NONE,
      text: ''
    });

    const sq_offset = !IS_ROUND ? px(4) : 0;

    const cursor_height = this.styles.input_field.text_size + px(4);
    const cursor_y_offset = (this.styles.input_field.h - cursor_height) / 2 - sq_offset;

    this.keyboard.state.ui.cursor_widget = createWidget(widget.FILL_RECT, {
      x: this.styles.input_field.x,
      y: this.styles.input_field.y + cursor_y_offset,
      w: px(2),
      h: cursor_height,
      color: 0x00FF00,
      radius: px(1),
      alpha: 255
    });

    this.keyboard.state.ui.input_overlay = createWidget(widget.FILL_RECT, {
      x: this.styles.input_field.x,
      y: this.styles.input_field.y,
      w: this.max_width,
      h: this.styles.input_field.h,
      alpha: 0
    });

    this.keyboard.state.ui.input_overlay.addEventListener(event.CLICK_UP, (info) => {
      this.handleInputFieldClick(info);
    });

    this.startCursorBlinking();
  }

  startCursorBlinking() {
    if (this.blink_timer) {
      clearTimeout(this.blink_timer);
    }

    const blink = () => {
      if (this.keyboard.state.has_pending_char || this.keyboard.state.is_in_multitap_mode) {
        this.cursor_visible = true;
        this.keyboard.state.ui.cursor_widget.setProperty(prop.ALPHA, 255);
        this.blink_timer = setTimeout(blink, 100);
        return;
      }

      const time_since_activity = Date.now() - this.last_activity_time;

      if (time_since_activity < 500) {
        this.cursor_visible = true;
        this.keyboard.state.ui.cursor_widget.setProperty(prop.ALPHA, 255);
        this.blink_timer = setTimeout(blink, 500 - time_since_activity);
      } else {
        this.cursor_visible = !this.cursor_visible;
        const alpha = this.cursor_visible ? 255 : 80;
        this.keyboard.state.ui.cursor_widget.setProperty(prop.ALPHA, alpha);
        this.blink_timer = setTimeout(blink, 500);
      }
    };

    blink();
  }

  resetCursorActivity() {
    this.last_activity_time = Date.now();

    if (this.keyboard.state.has_pending_char || this.keyboard.state.is_in_multitap_mode) {
      this.cursor_visible = true;
      this.keyboard.state.ui.cursor_widget.setProperty(prop.ALPHA, 255);
    } else {
      this.cursor_visible = true;
      this.keyboard.state.ui.cursor_widget.setProperty(prop.ALPHA, 255);
    }
  }

  handleInputFieldClick(click_info) {
    const click_x = click_info.x;
    const field_start_x = this.styles.input_field.x;
    const relative_click_x = click_x - field_start_x;

    debugLog(3, `input field clicked at x=${click_x}, relative=${relative_click_x}`);

    const new_cursor_pos = this.findCursorPositionFromClick(relative_click_x);

    if (new_cursor_pos !== this.keyboard.state.cursor_pos) {
      this.keyboard.multitapHandler.commitPendingChar();
      this.keyboard.state.cur_sequence = '';
      this.keyboard.state.cursor_pos = new_cursor_pos;
      debugLog(3, `cursor moved to position ${new_cursor_pos}`);

      this.resetCursorActivity();
      this.keyboard.updateKeyboardState();
    }
  }

  findCursorPositionFromClick(relative_click_x) {
    const full_text = this.keyboard.state.full_text;
    const text_len = full_text.length;
    if (text_len === 0) return 0;

    let best_pos = 0;
    let best_dist = relative_click_x > 0 ? relative_click_x : -relative_click_x;

    for (let pos = 1; pos <= text_len; pos++) {
      const cursor_x = this.getCursorXPosition(pos);
      const diff = relative_click_x - cursor_x;
      const dist = diff > 0 ? diff : -diff;

      if (dist < best_dist) {
        best_dist = dist;
        best_pos = pos;
      }
    }

    return best_pos;
  }

  isSurrogatePairBoundary(text, pos) {
    if (pos <= 0 || pos >= text.length) return false;

    const prev_code = text.charCodeAt(pos - 1);
    const cur_code = text.charCodeAt(pos);

    const is_high = (prev_code & 0xFC00) === 0xD800;
    const is_low = (cur_code & 0xDC00) === 0xDC00;

    return is_high && is_low;
  }

  getCurrentDisplayInfo() {
    const full_text = this.keyboard.state.full_text;
    const cur_pos = this.keyboard.state.cursor_pos;
    const pending = this.keyboard.state.has_pending_char ? this.keyboard.state.pending_char : '';

    const cache_key = `${full_text}|${cur_pos}|${pending}`;

    if (this.last_cache_key === cache_key && this.cached_display_info) {
      return this.cached_display_info;
    }

    let full_disp_text = full_text;

    if (this.keyboard.state.has_pending_char && this.keyboard.state.pending_char) {
      const pending_disp = this.keyboard.multitapHandler.applyCapitalization(this.keyboard.state.pending_char);
      full_disp_text = full_text.substring(0, cur_pos) + pending_disp + full_text.substring(cur_pos);
    }

    const max_width = this.max_width - 20;
    const estimated_width = this.calcTextWidth(full_disp_text);

    if (estimated_width <= max_width) {
      let full_cursor_pos = cur_pos;
      if (this.keyboard.state.has_pending_char && this.keyboard.state.pending_char) {
        full_cursor_pos = cur_pos + 1;
      }

      const display_cursor_pos = full_cursor_pos < 0 ? 0 :
        full_cursor_pos > full_disp_text.length ? full_disp_text.length :
          full_cursor_pos;

      const text_before_cursor = full_disp_text.substring(0, display_cursor_pos);
      const cursor_x = this.calcTextWidth(text_before_cursor);

      const result = {
        text: full_disp_text,
        truncated_chars: 0,
        cursor_x: cursor_x < 0 ? 0 : cursor_x
      };

      this.last_cache_key = cache_key;
      this.cached_display_info = result;
      return result;
    }

    const text_len = full_disp_text.length;
    let best_start_pos = 0;

    for (let start_pos = 1; start_pos < text_len; start_pos++) {
      if (this.isSurrogatePairBoundary(full_disp_text, start_pos)) {
        continue;
      }

      const remaining_text = full_disp_text.substring(start_pos);
      const test_width = this.ellipsis_width + this.calcTextWidth(remaining_text);

      if (test_width <= max_width) {
        best_start_pos = start_pos;
        break;
      }
    }

    if (best_start_pos === 0) {
      const result = {
        text: ELLIPSIS_CHAR,
        truncated_chars: text_len,
        cursor_x: 0
      };
      this.last_cache_key = cache_key;
      this.cached_display_info = result;
      return result;
    }

    const truncated = full_disp_text.substring(best_start_pos);
    const display_text = ELLIPSIS_CHAR + truncated;

    let full_cursor_pos = cur_pos;
    if (this.keyboard.state.has_pending_char && this.keyboard.state.pending_char) {
      full_cursor_pos = cur_pos + 1;
    }

    let display_cursor_pos = full_cursor_pos - best_start_pos;
    if (best_start_pos > 0) {
      display_cursor_pos += 1;
    }

    display_cursor_pos = display_cursor_pos < 0 ? 0 :
      display_cursor_pos > display_text.length ? display_text.length :
        display_cursor_pos;

    const text_before_cursor = display_text.substring(0, display_cursor_pos);
    const cursor_x = this.calcTextWidth(text_before_cursor);

    const result = {
      text: display_text,
      truncated_chars: best_start_pos,
      cursor_x: cursor_x < 0 ? 0 : cursor_x
    };

    this.last_cache_key = cache_key;
    this.cached_display_info = result;
    return result;
  }

  getCursorXPosition(text_pos) {
    const display_info = this.getCurrentDisplayInfo();
    let full_cursor_pos = text_pos;

    if (this.keyboard.state.has_pending_char && this.keyboard.state.pending_char) {
      full_cursor_pos = text_pos + 1;
    }

    let display_cursor_pos = full_cursor_pos - display_info.truncated_chars;
    if (display_info.truncated_chars > 0) {
      display_cursor_pos += 1;
    }

    display_cursor_pos = Math.max(0, Math.min(display_cursor_pos, display_info.text.length));
    const text_before_cursor = display_info.text.substring(0, display_cursor_pos);

    return Math.max(0, this.calcTextWidth(text_before_cursor));
  }

  updateCursorPosition() {
    const display_info = this.getCurrentDisplayInfo();
    const cursor_pos = this.keyboard.state.cursor_pos;
    const text_before_cursor = this.keyboard.state.full_text.substring(0, cursor_pos);
    let cursor_text = text_before_cursor;

    if (this.keyboard.state.has_pending_char && this.keyboard.state.pending_char) {
      const pending_display = this.keyboard.multitapHandler.applyCapitalization(this.keyboard.state.pending_char);
      cursor_text += pending_display;
    }

    const cursor_width = this.calcTextWidth(cursor_text);
    const cursor_x = this.styles.input_field.x + cursor_width - display_info.offset;

    this.keyboard.state.ui.cursor_widget.setProperty(prop.X,
      Math.max(this.styles.input_field.x,
        Math.min(cursor_x, this.styles.input_field.x + this.max_width - px(2))
      )
    );
  }

  updateSingleLineDisplay(is_multitap_only = false) {
    timeIt('updateSingleLineDisplay', () => {
      if (is_multitap_only && this.cached_display_info) {
        this.last_cache_key = '';
        const display_info = this.getCurrentDisplayInfo();

        if (display_info.text === this.last_rendered_text &&
          display_info.cursor_x === this.last_rendered_cursor_x) {
          return;
        }

        this.last_rendered_text = display_info.text;
        this.last_rendered_cursor_x = display_info.cursor_x;

        this.keyboard.state.ui.input_field_widget.setProperty(prop.TEXT, display_info.text);

        const cursor_x = this.styles.input_field.x + display_info.cursor_x;
        this.keyboard.state.ui.cursor_widget.setProperty(prop.X,
          Math.max(this.styles.input_field.x,
            Math.min(cursor_x, this.styles.input_field.x + this.max_width - px(2))
          )
        );
        return;
      }

      this.last_cache_key = '';
      const display_info = this.getCurrentDisplayInfo();

      if (display_info.text === this.last_rendered_text &&
        display_info.cursor_x === this.last_rendered_cursor_x) {
        return;
      }

      this.last_rendered_text = display_info.text;
      this.last_rendered_cursor_x = display_info.cursor_x;

      this.keyboard.state.ui.input_field_widget.setProperty(prop.TEXT, display_info.text);
      this.keyboard.state.ui.input_field_widget.setProperty(prop.X, this.styles.input_field.x);

      const cursor_x = this.styles.input_field.x + display_info.cursor_x;
      this.keyboard.state.ui.cursor_widget.setProperty(prop.X,
        Math.max(this.styles.input_field.x,
          Math.min(cursor_x, this.styles.input_field.x + this.max_width - px(2))
        )
      );
    });
  }

  destroy() {
    if (this.blink_timer) {
      clearTimeout(this.blink_timer);
      this.blink_timer = null;
    }
  }
}