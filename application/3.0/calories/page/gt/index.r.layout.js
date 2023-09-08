import * as hmUI from "@zos/ui";
import { getText } from "@zos/i18n";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const COMMON_TITLE_TEXT = {
  text: getText("calories"),
  x: px(96),
  y: px(40),
  w: DEVICE_WIDTH - 2 * px(96),
  h: px(46),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};

export const ALIGN_DESC_GROUP = {
  x: 0,
  y: px(118),
  w: 0,
  h: px(100),
};
export const IMGAE_CALORIES_MARIN = 0;
export const CALORIES_UNIT_MARIN = px(8);
export const CALORIE_TEXT_SIZE = px(100);
export const CALORIE_TEXT = {
  text: "",
  x: 0,
  y: 0,
  w: 0,
  h: px(100),
  color: 0xffffff,
  text_size: CALORIE_TEXT_SIZE,
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
};
export const UNIT_TEXT_SIZE = px(28);
export const UNIT_TEXT = {
  text: getText("unit"),
  x: 0,
  y: px(63),
  w: 0,
  h: px(34),
  color: 0x999999,
  text_size: UNIT_TEXT_SIZE,
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
};

export const TOTAL_CONSUME_TEXT = {
  text: getText("consumption"),
  x: px(40),
  y: px(218),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(38),
  color: 0x999999,
  text_size: px(28),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const EQUIVALENT_TO_BUTTON = {
  text: getText("equivalent"),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(108),
  y: px(376),
  w: DEVICE_WIDTH - 2 * px(108),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

export const CONSUME_ICON_WIDTH = px(48);
export const CONSUME_ICON = {
  src: "consume.png",
  x: 0,
  y: px(53),
};

export const EQUIVALENT_MARGIN = px(8);
export const EQUIVALENT_MORE_X = px(155);
export const EQUIVALENT_TO_FOOD_ICON_WIDTH = px(80);

export const EQUIVALENT_TO_FOOD_ICON = {
  src: "food/hamburger.png",
  x: 0,
  y: px(288),
};

export const EQUIVALENT_MORE_FOOD_ICON = {
  src: "multiply.png",
  x: px(243),
  y: px(304),
};

export const EQUIVALENT_MORE_FOOD_NUM = {
  text: "",
  x: px(299),
  y: px(294),
  w: px(100),
  h: px(60),
  color: 0xee801e,
  text_size: px(55),
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
};
