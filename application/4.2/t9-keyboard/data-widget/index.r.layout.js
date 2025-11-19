// index.r.layout.js
import { px } from '@zos/utils';
import { DeviceInfo } from '../helpers/required';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = DeviceInfo;

const COLOR_BG = 0x2a2a2c;
const COLOR_WHITE = 0xffffff;
const COLOR_SEP = 0x555555;

const INPUT_TEXT_SIZE = px(28);

export const styles = {
  bg_fill_rect: {
    x: 0, y: 0, w: DEVICE_WIDTH, h: DEVICE_HEIGHT, color: COLOR_BG,
  },

  new_separator: {
    top_sep: {
      x: 25, y: 59, w: 428, h: 59, color: COLOR_SEP
    },
    bot_sep: {
      x: 89, y: 117, w: 301, h: 372, color: COLOR_SEP
    }
  },

  input_field: {
    x: px(70), y: px(70), w: px(350), h: px(40),
    color: COLOR_WHITE, text_size: INPUT_TEXT_SIZE, align_h: 'left', align_v: 'center',
  },

  t9_grid: {
    x: px(110), y: px(140), w: px(260), h: px(320),
    row_gap: px(8), col_gap: px(8),
  },
  
  t9_key_btn: {
    normal_src: null, press_src: null,
    text_color: COLOR_WHITE, 
    text_size: px(28),
    olay_text_size: px(20),
  },

  prediction_bar: {
    x: px(40), y: px(10), w: px(400), h: px(50),
  },

  icons: {
    numbers:      { x: px(21), y: px(141), src: 'kb_icons/num.png' },
    voice:        { x: px(12), y: px(214), src: 'kb_icons/voice.png' },
    shift_off:    { x: px(31), y: px(309), src: 'kb_icons/shift_off.png' },
    shift_on:     { x: px(31), y: px(309), src: 'kb_icons/shift_on.png' },
    shift_caps:   { x: px(31), y: px(309), src: 'kb_icons/shift_on_caps.png' },
    backspace:    { x: px(350), y: px(60), src: 'kb_icons/delete.png' },
    smiley:       { x: px(403), y: px(132), src: 'kb_icons/face.png' },
    confirm:      { x: px(408), y: px(203), src: 'kb_icons/check.png' },
    cancel:       { x: px(408), y: px(203), src: 'kb_icons/cancel.png' },
    globe:        { x: px(395), y: px(286), src: 'kb_icons/globe.png' },
    space:        { x: px(208), y: px(394), src: 'kb_icons/blank.png' },
    t9:           { x: px(404), y: px(142), src: 'kb_icons/t9.png' },
  },

  icon_hitbox: {
    normal_color: 0x000000, press_color: 0x33FFFF,
  },
};