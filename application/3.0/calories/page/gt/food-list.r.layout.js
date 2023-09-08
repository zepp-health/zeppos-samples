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

export const FOOD_LIST_Y = px(178);
export const FOOD_LIST_ITEM_MARGIN = px(64);
export const FOOD_LIST_ITEM_HEIGHT = px(64);
export const FOOD_LIST_RADIOGROUP = {
  select_src: "selected.png",
  unselect_src: "unselected.png",
  x: px(44),
  y: px(FOOD_LIST_Y),
  w: -1,
  h: -1,
};

export const FOOD_LIST_RADIO_ITEM = {
  x: 0,
  y: 0,
  w: px(FOOD_LIST_ITEM_HEIGHT),
  h: px(FOOD_LIST_ITEM_HEIGHT),
};

export const FOOD_LIST_RADIO_ITEM_TEXT = {
  x: px(120),
  y: 0,
  w: px(360),
  h: px(64),
  color: 0xffffff,
  text_size: px(32),
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
};
