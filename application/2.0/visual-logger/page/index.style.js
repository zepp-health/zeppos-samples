import { px } from "@zos/utils";
import * as hmUI from "@zos/ui";
import * as constants from "./index.const";

export const BORDER_SQUARE = {
  x: px(0),
  y: px(0),
  w: px(constants.DEVICE_WIDTH),
  h: px(constants.DEVICE_HEIGHT),
  color: constants.LINE_COLOR,
};

export const ARC = {
  x: px(0),
  y: px(0),
  w: px(constants.DEVICE_WIDTH),
  h: px(constants.DEVICE_HEIGHT),
  color: constants.LINE_COLOR,
  line_width: 2,
  start_angle: 0,
  end_angle: 360,
};

export const BTN_RIGHT = {
  x: px(constants.BTN_R_POS_X),
  y: px(constants.BTN_POS_Y),
  w: px(constants.BTN_WIDTH),
  h: px(constants.BTN_HEIGHT),
  radius: 90,
  normal_color: constants.COLOR_ORANGE_NORM,
  press_color: constants.COLOR_ORANGE_PRESS,
  text_size: 32,
  text: "➡️", // ➡
};

export const BTN_LEFT = {
  x: px(constants.BTN_L_POS_X),
  y: px(constants.BTN_POS_Y),
  w: px(constants.BTN_WIDTH),
  h: px(constants.BTN_HEIGHT),
  radius: 90,
  normal_color: constants.COLOR_ORANGE_NORM,
  press_color: constants.COLOR_ORANGE_PRESS,
  text_size: 32,
  text: "⬅️",
};

export const SWITCH = {
  x: px(constants.SW_POS_X),
  y: px(constants.SW_POS_Y),
  w: px(constants.SW_WIDTH),
  h: px(constants.SW_HEIGHT),
  select_bg: "switch_on.png",
  un_select_bg: "switch_off.png",
  slide_src: "radio_select.png",
  slide_select_x: 40,
  slide_un_select_x: 8,
  checked: true,
};

export const TXT_TOP = {
  y: px(constants.SW_POS_Y - constants.TEXT_SIZE * 3),
  w: px(constants.DEVICE_WIDTH),
  h: px(constants.TEXT_SIZE * 4),
  color: constants.COLOR_WHITE,
  text_size: constants.TEXT_SIZE,
  align_h: hmUI.align.CENTER_H,
  text_style: hmUI.text_style.ELLIPSIS,
};

export const TXT_BOT = {
  y: px(constants.SW_POS_Y + constants.TEXT_SIZE * 3 - constants.TEXT_SIZE / 2),
  w: px(constants.DEVICE_WIDTH),
  h: px(constants.TEXT_SIZE * 4),
  color: constants.COLOR_WHITE,
  text_size: constants.TEXT_SIZE,
  align_h: hmUI.align.CENTER_H,
  text_style: hmUI.text_style.ELLIPSIS,
};

export const BTN_1 = {
  x: px(constants.BTN_NUM_POS_X - constants.BTN_WIDTH * 1.5),
  y: px(constants.BTN_POS_Y),
  w: px(constants.BTN_WIDTH),
  h: px(constants.BTN_HEIGHT),
  radius: 12,
  normal_color: constants.COLOR_BLUE_NORM,
  press_color: constants.COLOR_BLUE_PRESS,
  text_size: 64,
  text: "1",
};

export const BTN_2 = {
  x: px(constants.BTN_NUM_POS_X),
  y: px(constants.BTN_POS_Y),
  w: px(constants.BTN_WIDTH),
  h: px(constants.BTN_HEIGHT),
  radius: 12,
  normal_color: constants.COLOR_BLUE_NORM,
  press_color: constants.COLOR_BLUE_PRESS,
  text_size: 64,
  text: "2",
};

export const BTN_3 = {
  x: px(constants.BTN_NUM_POS_X + constants.BTN_WIDTH * 1.5),
  y: px(constants.BTN_POS_Y),
  w: px(constants.BTN_WIDTH),
  h: px(constants.BTN_HEIGHT),
  radius: 12,
  normal_color: constants.COLOR_BLUE_NORM,
  press_color: constants.COLOR_BLUE_PRESS,
  text_size: 64,
  text: "3",
};

export const BTN_1_RED = {
  ...BTN_1,
  normal_color: constants.COLOR_RED_NORM,
  press_color: constants.COLOR_RED_PRESS,
  text: "",
};
export const BTN_2_GREEN = {
  ...BTN_2,
  normal_color: constants.COLOR_GREEN_NORM,
  press_color: constants.COLOR_GREEN_PRESS,
  text: "",
};
export const BTN_3_BLUE = {
  ...BTN_3,
  text: "",
};
