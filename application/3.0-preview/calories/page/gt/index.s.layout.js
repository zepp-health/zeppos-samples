import * as hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'
import { DEVICE_WIDTH } from '../../utils/constants'

export const COMMON_TITLE_TEXT = null
export const ALIGN_DESC_GROUP = {
  x: 0,
  y: px(80),
  w: 0,
  h: px(82),
}
export const IMGAE_CALORIES_MARIN = 0
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
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
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
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
}

export const TOTAL_CONSUME_TEXT = {
  text: getText('consumption'),
  x: px(4),
  y: px(162),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(38),
  color: 0x999999,
  text_size: px(28),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
}

export const EQUIVALENT_TO_BUTTON = {
  text: getText('equivalent'),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(71),
  y: px(330),
  w: DEVICE_WIDTH - 2 * px(71),
  h: px(56),
  color: 0xffffff,
  text_size: px(28),
  radius: px(28),
}

export const CONSUME_ICON_WIDTH = px(32)
export const CONSUME_ICON = {
  src: 'consume.png',
  x: 0,
  y: px(47),
}

export const EQUIVALENT_MARGIN = px(8)
export const EQUIVALENT_MORE_X = px(113)
export const EQUIVALENT_TO_FOOD_ICON_WIDTH = px(72)

export const EQUIVALENT_TO_FOOD_ICON = {
  src: 'food/hamburger.png',
  x: px(103), //0
  y: px(224),
}

export const EQUIVALENT_MORE_FOOD_ICON = {
  src: 'multiply.png',
  x: px(183),
  y: px(235),
}

export const EQUIVALENT_MORE_FOOD_NUM = {
  text: '',
  x: px(237),
  y: px(225),
  w: px(60),
  h: px(60),
  color: 0xee801e,
  text_size: px(50),
  align_h: hmUI.align.LEFT,
  align_v: hmUI.align.CENTER_V,
}
