import { getDeviceInfo } from '@zos/device'
import ui from '@zos/ui'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const TEXT_STYLE = {
  text: 'NULL',
  x: px(42),
  y: px(100),
  w: DEVICE_WIDTH - px(42) * 2,
  h: px(100),
  color: 0xff00ff,
  text_size: px(20),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

export const BTN_STYLE = {
  text: 'send request',
  x: px(42),
  y: px(200),
  w: DEVICE_WIDTH - px(42) * 2,
  h: px(100),
  color: 0xff00ff,
  text_size: px(36),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

