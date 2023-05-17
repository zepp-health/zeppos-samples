import { align, text_style } from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const TITLE_TEXT_STYLE = {
  text: getText('todoList'),
  x: px(42),
  y: px(65),
  w: DEVICE_WIDTH - px(42 * 2),
  h: px(50),
  color: 0xffffff,
  text_size: 36,
  align_h: align.CENTER_H,
  text_style: text_style.WRAP,
}

export const ADD_BUTTON = {
  text: getText('add'),
  x: px(30),
  y: px(65),
  w: px(80),
  h: px(50),
  normal_color: 0xfc6950,
  press_color: 0xfeb4a8,
  radius: px(12)
}

export const TIPS_TEXT_STYLE = {
  text: getText('noData'),
  x: px(15),
  y: px(120),
  w: DEVICE_WIDTH - px(15 * 2),
  h: DEVICE_HEIGHT - px(120),
  color: 0xffffff,
  text_size: 32,
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: text_style.WRAP,
}

export const SCROLL_LIST = {
  item_height: px(80),
  item_space: px(6),
  item_config: [
    {
      type_id: 1,
      item_bg_color: 0x333333,
      item_bg_radius: px(10),
      text_view: [
        {
          x: px(80),
          y: px(0),
          w: px(360),
          h: px(80),
          key: 'name',
          color: 0xffff00,
          text_size: px(36),
          align_h: align.LEFT,
        },
      ],
      text_view_count: 1,
      item_height: px(80),
    },
    {
      type_id: 2,
      item_bg_color: 0x333333,
      item_bg_radius: px(10),
      text_view: [
        {
          x: px(80),
          y: px(0),
          w: px(360),
          h: px(80),
          key: 'name',
          color: 0xff0000,
          text_size: px(36),
          align_h: align.LEFT,
        },
      ],
      text_view_count: 1,
      item_height: px(80),
    },
  ],
  item_config_count: 2,
  x: px(30),
  y: px(120),
  h: DEVICE_HEIGHT - px(180),
  w: DEVICE_WIDTH - px(30) * 2,
}
