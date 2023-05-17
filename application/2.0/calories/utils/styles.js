import { align, text_style } from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const COMMON_TITLE_TEXT = {
  text: getText('calories'),
  x: px(96),
  y: px(40),
  w: px(288),
  h: px(46),
  color: 0xffffff,
  text_size: px(36),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: text_style.WRAP,
}

export const ALIGN_DESC_GROUP = {
  x: 0,
  y: px(118),
  w: 0,
  h: px(100),
}
export const IMGAE_CALORIES_MARIN = px(0)
export const CALORIES_UNIT_MARIN = px(8)
export const CALORIE_TEXT_SIZE = px(100)
export const CALORIE_TEXT = {
  text: '',
  x: px(0),
  y: px(0),
  w: px(0),
  h: px(100),
  color: 0xffffff,
  text_size: CALORIE_TEXT_SIZE,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}
export const UNIT_TEXT_SIZE = px(28)
export const UNIT_TEXT = {
  text: getText('unit'),
  x: px(0),
  y: px(63),
  w: px(0),
  h: px(34),
  color: 0x999999,
  text_size: UNIT_TEXT_SIZE,
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}

export const TOTAL_CONSUME_TEXT = {
  text: getText('consumption'),
  x: px(40),
  y: px(218),
  w: px(400),
  h: px(38),
  color: 0x999999,
  text_size: px(28),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
}

export const EQUIVALENT_TO_BUTTON = {
  text: getText('equivalent'),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(108),
  y: px(376),
  w: px(264),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
}

export const CONSUME_ICON_WIDTH = px(48)
export const CONSUME_ICON = {
  src: 'consume.png',
  x: px(0),
  y: px(53),
}

export const EQUIVALENT_MARGIN = 8
export const EQUIVALENT_MORE_X = 155
export const EQUIVALENT_TO_FOOD_ICON_WIDTH = 80

export const EQUIVALENT_TO_FOOD_ICON = {
  src: 'food/hamburger.png',
  x: px(0),
  y: px(288),
}

export const EQUIVALENT_MORE_FOOD_ICON = {
  src: 'multiply.png',
  x: px(243),
  y: px(304),
}

export const EQUIVALENT_MORE_FOOD_NUM = {
  text: '',
  x: px(299),
  y: px(294),
  w: px(100),
  h: px(60),
  color: 0xee801e,
  text_size: px(55),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}

export const FOOD_LIST_Y = 178
export const FOOD_LIST_ITEM_MARGIN = 64
export const FOOD_LIST_ITEM_HEIGHT = 64
export const FOOD_LIST_RADIOGROUP = {
  select_src: 'selected.png',
  unselect_src: 'unselected.png',
  x: px(44),
  y: px(FOOD_LIST_Y),
  w: -1,
  h: -1,
}

export const FOOD_LIST_RADIO_ITEM = {
  x: px(0),
  y: px(0),
  w: px(FOOD_LIST_ITEM_HEIGHT),
  h: px(FOOD_LIST_ITEM_HEIGHT),
}

export const FOOD_LIST_RADIO_ITEM_TEXT = {
  x: px(120),
  y: px(0),
  w: px(360),
  h: px(64),
  color: 0xffffff,
  text_size: px(32),
  align_h: align.LEFT,
  align_v: align.CENTER_V,
}
