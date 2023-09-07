import hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../libs/utils";

export const MAIN_TITLE_STYLE = {
  x: px(40),
  y: px(60),
  w: DEVICE_WIDTH - px(40) * 2,
  h: px(100),
  text_size: px(32),
  align_h: hmUI.align.CENTER_H,
  color: 0xffffff,
};

export const MAIN_BUTTON_W = px(200);
export const MAIN_BUTTON_H = px(45);
export const MAIN_BUTTON_X = (DEVICE_WIDTH - MAIN_BUTTON_W) / 2;
export const MAIN_BUTTON_Y = px(170);
export const MAIN_BUTTON_OY = px(50);
export const MAIN_BUTTON = {
  x: MAIN_BUTTON_X,
  y: MAIN_BUTTON_Y,
  w: MAIN_BUTTON_W,
  h: MAIN_BUTTON_H,
  radius: 8,
  press_color: 0x1976d2,
  normal_color: 0xef5350,
};

const BUTTON_X = px(70);
export const BUTTON_Y = px(80);
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
export const BUTTON_H = px(50);
const BUTTON_MARGIN_TOP = px(20);
export const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

export const START_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: px(16),
};

export const BG_RECT = {
  x: 0,
  y: 0,
  w: DEVICE_WIDTH,
  color: 0x000000,
};

export const STOP_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y + BUTTON_H * 2,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: px(16),
};

export const TEXT_STYLE = {
  x: BUTTON_X,
  y: BUTTON_Y + BUTTON_H * 4,
  w: BUTTON_W,
  h: BUTTON_H * 2,
  text_size: px(18),
  color: 0x34e073,
};

export const WORKOUT_TEXT_STYLE = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H * 6,
  text_style: hmUI.text_style.WRAP,
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_size: px(18),
  text: "workout Info",
  color: 0x34e073,
};

export const CANVAS_1 = {
  center_x: px(24),
  center_y: px(104),
  radius: px(24),
};

export const CANVAS_2 = {
  center_x: px(51),
  center_y: px(131),
  radius: px(12),
};

export const CANVAS_BUTTON = {
  x: (DEVICE_WIDTH - px(300)) / 2,
  y: px(330),
  width: px(300),
  height: px(105),
};

export const CANVAS_TEXT = {
  x: px(120),
  y: px(30),
  text_size: px(40),
};

export const CANVAS_STYLE_1 = {
  x: 0,
  y: px(180),
  w: DEVICE_WIDTH,
  h: px(64),
};

export const CANVAS_STYLE_1_IMG = {
  x: 0,
  y: 0,
  w: px(64),
  h: px(64),
  alpha: 255,
};

export const CANVAS_STYLE_2 = {
  x: px(100),
  y: px(100),
  w: DEVICE_WIDTH - px(200),
  h: px(200),
};

export const CANVAS_STYLE_2_REC_1 = {
  x1: px(150),
  y1: px(80),
  x2: px(170),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_2_REC_2 = {
  x1: px(180),
  y1: px(80),
  x2: px(220),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_2_REC_3 = {
  x1: px(230),
  y1: px(80),
  x2: px(250),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_2_CLEAR_1 = {
  x: 0,
  y: 0,
  w: DEVICE_WIDTH - px(200),
  h: DEVICE_HEIGHT - px(100),
};

export const CANVAS_STYLE_2_REC_4 = {
  x1: px(150),
  y1: px(80),
  x2: px(150),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_2_REC_5 = {
  x1: px(160),
  y1: px(80),
  x2: px(200),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_2_REC_6 = {
  x1: px(210),
  y1: px(80),
  x2: px(250),
  y2: px(143),
  color: 0xe3a869,
};

export const CANVAS_STYLE_1_CLEAR_1 = {
  y: 0,
  w: px(64),
  h: px(64),
};

export const SERVICE_TEXT = {
  x: px(40),
  y: px(80),
  w: DEVICE_WIDTH - px(40) * 2,
  h: px(80),
  text_size: px(24),
  align_h: hmUI.align.CENTER_H,
  color: 0xffffff,
};
export const SERVICE_LABEL = {
  x: px(40),
  y: px(180),
  w: DEVICE_WIDTH - px(40) * 2,
  h: px(120),
  text_size: px(24),
  align_h: hmUI.align.CENTER_H,
  color: 0xffffff,
};
export const SERVICE_BTN = {
  x: px(100),
  y: px(280),
  w: DEVICE_WIDTH - px(100) * 2,
  h: px(50),
  radius: 8,
  press_color: 0x1976d2,
  normal_color: 0xef5350,
};
