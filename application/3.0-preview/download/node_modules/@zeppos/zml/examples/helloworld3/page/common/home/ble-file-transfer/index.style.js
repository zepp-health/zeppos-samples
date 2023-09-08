import { px } from '@zos/utils'
import { getDeviceInfo } from '@zos/device'
import ui from '@zos/ui'

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
  text: 'send file',
  x: px(42),
  y: px(300),
  w: DEVICE_WIDTH - px(42) * 2,
  h: px(50),
  color: 0xff00ff,
  text_size: px(36),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

export const BTN_STYLE2 = {
  text: 'cancel',
  x: px(42),
  y: px(350),
  w: DEVICE_WIDTH - px(42) * 2,
  h: px(50),
  color: 0xff00ff,
  text_size: px(36),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

export const IMG_STYLE = {
  x: px(100),
  y: px(400),
  src: 'image/logo.png',
}

export const PROGRESS_GROUP = {
  x: px(150),
  y: px(180),
  w: px(30),
  h: px(180),
}

export const FILE_NAME_STYLE = {
  text: 'receiving',
  x: px(0),
  y: px(0),
  w: px(150),
  h: px(30),
  color: 0xffffff,
  text_size: px(20),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

export const PROGRESS_TEXT_STYLE = {
  text: '0',
  x: px(150),
  y: px(0),
  w: px(30),
  h: px(30),
  color: 0xffffff,
  text_size: px(20),
  align_h: ui.align.CENTER_H,
  text_style: ui.text_style.WRAP,
}

export const PROGRESS_STYLE = {
  x: px(150),
  y: px(0),
  w: px(30),
  h: px(30),
  radius: 15,
  start_angle: -90,
  end_angle: 270,
  // color: 0x34e073,
  color: 0xffffff,
  line_width: 2,
}
