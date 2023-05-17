import { align, text_style } from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const COMMON_TITLE_TEXT = {
  text: getText('calories'),
  x: 32,
  y: 11,
  w: 232,
  h: 42,
  color: 0xffffff,
  text_size: 32,
  align_v: align.LEFT,
  text_style: text_style.WRAP,
}
export const ALIGN_DESC_GROUP = {
  x: 0,
  y: px(80),
  w: 0,
  h: px(82),
}
export const IMGAE_CALORIES_MARIN = px(0)
export const CALORIES_UNIT_MARIN = px(8)
export const CALORIE_TEXT_SIZE = px(72)
export const CALORIE_TEXT = {
  text: '400',
  x: 0,
  y: 0,
  w: 0,
  h: px(82),
  color: 0xffffff,
  text_size: CALORIE_TEXT_SIZE,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}
export const UNIT_TEXT_SIZE = px(24)
export const UNIT_TEXT = {
  text: getText('unit'),
  x: 0,
  y: px(46),
  w: 0,
  h: px(34),
  color: 0x999999,
  text_size: UNIT_TEXT_SIZE,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}

export const TOTAL_CONSUME_TEXT = {
  text: getText('consumption'),
  x: 4,
  y: 162,
  w: 382,
  h: 38,
  color: 0x999999,
  text_size: 28,
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
}

export const EQUIVALENT_TO_BUTTON = {
  text: getText('equivalent'),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: 71,
  y: 330,
  w: 248,
  h: 48,
  color: 0xffffff,
  text_size: 28,
  radius: 28,
}

export const CONSUME_ICON_WIDTH = px(32)
export const CONSUME_ICON = {
  src: 'consume.png',
  x: 0,
  y: px(47),
}

export const EQUIVALENT_MARGIN = 8
export const EQUIVALENT_MORE_X = 113
export const EQUIVALENT_TO_FOOD_ICON_WIDTH = 72

export const EQUIVALENT_TO_FOOD_ICON = {
  src: 'food/hamburger.png',
  x: 103, //0
  y: 224,
}

export const EQUIVALENT_MORE_FOOD_ICON = {
  src: 'multiply.png',
  x: 183,
  y: 235,
}

export const EQUIVALENT_MORE_FOOD_NUM = {
  text: '',
  x: 237,
  y: 225,
  w: 60,
  h: 60,
  color: 0xee801e,
  text_size: 50,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}

export const FOOD_LIST_Y = 96
export const FOOD_LIST_ITEM_MARGIN = 60
export const FOOD_LIST_ITEM_HEIGHT = 52
export const FOOD_LIST_RADIOGROUP = {
  select_src: 'selected.png',
  unselect_src: 'unselected.png',
  x: 30,
  y: FOOD_LIST_Y,
  w: -1,
  h: -1,
}

export const FOOD_LIST_RADIO_ITEM = {
  x: 0,
  y: FOOD_LIST_Y,
  w: FOOD_LIST_ITEM_HEIGHT,
  h: FOOD_LIST_ITEM_HEIGHT,
}

export const FOOD_LIST_RADIO_ITEM_TEXT = {
  x: 106,
  y: 97,
  w: 254,
  h: FOOD_LIST_ITEM_HEIGHT,
  color: 0xffffff,
  text_size: 32,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}
