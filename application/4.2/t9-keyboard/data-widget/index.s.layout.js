// index.s.layout.js
import { px } from '@zos/utils';
import { DeviceInfo } from '../helpers/required';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = DeviceInfo;

const COLOR_BG = 0x2a2a2c;
const COLOR_WHITE = 0xffffff;
const COLOR_SEP = 0x555555;

export const styles = {
  bg_fill_rect: {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: DEVICE_HEIGHT,
    color: COLOR_BG,
  },

  new_separator: {
    top_sep: {
      x: px(-19),
      y: px(56),
      w: px(426),
      h: px(59),
      line_width: px(1),
      radius: 0,
      color: COLOR_SEP
    },
    
    bot_sep: {
      x: px(95),
      y: px(114),
      w: px(308),
      h: px(372),
      line_width: px(1),
      radius: 0,
      color: COLOR_SEP
    }
  },

  input_field: {
    x: px(12),
    y: px(64),
    w: px(300),
    h: px(50),
    color: COLOR_WHITE,
    text_size: px(28),
    align_h: 'left',
    align_v: 'center',
  },

  t9_grid: {
    x: px(111),
    y: px(126),
    w: px(257),
    h: px(241),
    row_gap: px(32),
    col_gap: px(16),
  },
  
  t9_key_btn: {
    normal_src: null,
    press_src: null,
    text_color: COLOR_WHITE,
    text_size: px(24),
  },

  prediction_bar: {
    x: px(78),
    y: px(0),
    w: px(233),
    h: px(50),
  },

  icons: {
    // top right
    backspace: { x: px(328), y: px(59), src: 'kb_icons/delete.png' },
    
    // left column
    voice:     { x: px(20), y: px(133), src: 'kb_icons/voice.png' },
    smiley:    { x: px(20), y: px(206), src: 'kb_icons/face.png' },
    numbers:   { x: px(16), y: px(293), src: 'kb_icons/num.png' },
    globe:     { x: px(16), y: px(352), src: 'kb_icons/globe.png' },
    

    // bottom row

    // shift
    shift_off:  { x: px(123), y: px(394), src: 'kb_icons/shift_off.png' },
    shift_on:   { x: px(123), y: px(394), src: 'kb_icons/shift_on.png' },
    shift_caps: { x: px(123), y: px(394), src: 'kb_icons/shift_on_caps.png' },
    
    space:     { x: px(205), y: px(380), src: 'kb_icons/blank.png' },
    confirm:   { x: px(304), y: px(375), src: 'kb_icons/check.png' },
    cancel:    { x: px(304), y: px(375), src: 'kb_icons/cancel.png' },
    
    // T9 mode
    t9:        { x: px(16), y: px(293), src: 'kb_icons/t9.png' },
  },

  icon_hitbox: {
    normal_color: 0x000000,
    press_color: 0x33FFFF,
  },
};