import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";

export const COMMON_TITLE_TEXT = null;
export const FOOD_LIST_Y = px(96);
export const FOOD_LIST_ITEM_MARGIN = px(60);
export const FOOD_LIST_ITEM_HEIGHT = px(52);
export const FOOD_LIST_RADIOGROUP = {
  select_src: "selected.png",
  unselect_src: "unselected.png",
  x: px(30),
  y: FOOD_LIST_Y,
  w: -1,
  h: -1,
};

export const FOOD_LIST_RADIO_ITEM = {
  x: 0,
  y: FOOD_LIST_Y,
  w: FOOD_LIST_ITEM_HEIGHT,
  h: FOOD_LIST_ITEM_HEIGHT,
};

export const FOOD_LIST_RADIO_ITEM_TEXT = {
  x: px(106),
  y: px(97),
  w: px(254),
  h: FOOD_LIST_ITEM_HEIGHT,
  color: 0xffffff,
  text_size: px(32),
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
};
